import express from "express";
import User from "../models/User.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Get All Members (Admin Only)
router.get("/members", protect, adminOnly, async (req, res) => {
  try {
    const members = await User.find(
      { role: "member" },
      "-password"
    );

    res.json({
      success: true,
      members,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

export default router;