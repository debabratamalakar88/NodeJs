import session from "express-session";
import MongoStore from "connect-mongo";
import { connectDB } from "../config/database.js";
import dotenv from 'dotenv';
export const sessionMiddleware = session({
  secret: dotenv.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    //secure: config.NODE_ENV === "production", // Use secure cookies in production
    //httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
  },
  store: MongoStore.create({
    mongoUrl: connectDB(),
    collectionName: "sessions",
    ttl: 14 * 24 * 60 * 60, // Session expiration time in seconds (14 days)
  }),
});

// Uncomment the following lines to use the session middleware in your Express app

/* app.get("/login", (req, res) => {
  // Simulate a login
  req.session.user = { id: 1, name: "John Doe" };
  res.json({ message: "Logged in successfully" });
}
);

app.get("/session", (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ message: "No session found" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to log out" });
    }
    res.json({ message: "Logged out successfully" });
  });
}); */