import express from "express";
import passport from "passport";
import { login } from "../controllers/auth.js";
import { verifyGoogleToken } from "../utils/googleAuth.js";
import { findOrCreateUser } from "../controllers/auth.js";


const router = express.Router();

// ✅ Google Login Route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// ✅ Google Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication
    res.redirect("/"); // Redirect to your frontend or home page
  }
);

// ✅ Google Login with Token (for frontend)
router.post("/google-login", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await verifyGoogleToken(token); // Implement token verification
    const payload = ticket.getPayload();

    // Handle user registration or login
    const user = await findOrCreateUser(payload); // Implement this function

    res.status(200).json({ success: true, user, token });
  } catch (error) {
    res.status(400).json({ success: false, message: "Google Login Failed" });
  }
});

router.post("/login", login);

export default router;