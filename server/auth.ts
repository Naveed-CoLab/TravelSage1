import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "trip-planner-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );
  
  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "/api/auth/google/callback",
          scope: ["profile", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user already exists by email
            const email = profile.emails?.[0]?.value;
            if (!email) {
              return done(new Error("No email provided by Google"));
            }

            // Use email as username to find user, since for Google auth we don't have a username
            let user = await storage.getUserByEmail(email);
            
            if (!user) {
              // Create a new user if not exists
              const username = profile.displayName?.replace(/\s+/g, "") || 
                `user_${Math.random().toString(36).substring(2, 8)}`;
              
              // Check if the username is already taken
              let usernameExists = await storage.getUserByUsername(username);
              let uniqueUsername = username;
              
              // If username exists, add a random string to make it unique
              if (usernameExists) {
                uniqueUsername = `${username}_${Math.random().toString(36).substring(2, 8)}`;
              }
              
              user = await storage.createUser({
                username: uniqueUsername,
                email,
                // Generate a random secure password that won't be used (user will login via Google)
                password: await hashPassword(randomBytes(16).toString('hex')),
                firstName: profile.name?.givenName || '',
                lastName: profile.name?.familyName || '',
                googleId: profile.id
              });
            } else if (!user.googleId) {
              // If user exists but doesn't have a Google ID, update it
              user = await storage.updateUser(user.id, {
                ...user,
                googleId: profile.id
              });
            }
            
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  } else {
    console.warn("Google authentication is not configured. GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set.");
  }

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, email, password, firstName, lastName } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email, and password are required" });
      }
      
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await storage.createUser({
        username,
        email,
        password: await hashPassword(password),
        firstName,
        lastName
      });

      // Remove password from the response
      const { password: _, ...userWithoutPassword } = user;

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "An error occurred during registration" });
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        
        // Remove password from the response
        const { password, ...userWithoutPassword } = user;
        
        return res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Remove password from the response
    const { password, ...userWithoutPassword } = req.user;
    
    res.json(userWithoutPassword);
  });

  // Google authentication routes
  app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/auth" }),
    (req, res) => {
      // Successful authentication, redirect to home page
      res.redirect("/");
    }
  );
}
