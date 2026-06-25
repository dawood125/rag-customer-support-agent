import { Request, Response } from "express";
import { Company } from "../models/Company";
import { User } from "../models/User";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
  clearCookieOptions,
} from "../config/cookies";
import { RegisterRequestBody, LoginRequestBody } from "../types";

export async function register(
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response,
) {
  try {
    const { companyName, name, email, password } = req.body;
    if (!companyName || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const company = await Company.create({
      name: companyName,
      email: email.toLowerCase(),
      plan: "free",
      monthlyMessageLimit: 100,
    });

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: "admin",
      companyId: company._id,
    });

    const tokenPayload = {
      userId: user._id.toString(),
      companyId: company._id.toString(),
      role: user.role,
    };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          companyId: user.companyId,
        },
        company: {
          _id: company._id,
          name: company.name,
          plan: company.plan,
        },
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
}

export async function login(
  req: Request<{}, {}, LoginRequestBody>,
  res: Response,
) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated",
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const company = await Company.findById(user.companyId);

    if (!company || !company.isActive) {
      return res.status(403).json({
        success: false,
        message: "Company account is inactive",
      });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const tokenPayload = {
      userId: user._id.toString(),
      companyId: company._id.toString(),
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          companyId: user.companyId,
        },
        company: {
          _id: company._id,
          name: company.name,
          plan: company.plan,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    res.clearCookie("accessToken", clearCookieOptions);
    res.clearCookie("refreshToken", clearCookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

export async function refreshAccessToken(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found",
      });
    }

    const decoded = verifyRefreshToken(refreshToken);

    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found or inactive",
      });
    }

    const tokenPayload = {
      userId: user._id.toString(),
      companyId: user.companyId.toString(),
      role: user.role,
    };

    const newAccessToken = generateAccessToken(tokenPayload);

    res.cookie("accessToken", newAccessToken, accessTokenCookieOptions);

    return res.status(200).json({
      success: true,
      message: "Token refreshed",
    });
  } catch (error) {
    console.error("Refresh error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
}
