import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshAccessToken,
} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);

router.post("/logout", authenticate, logout);

router.get("/me", authenticate, (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

export default router