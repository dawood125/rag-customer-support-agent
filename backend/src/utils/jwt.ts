import jwt, { SignOptions } from "jsonwebtoken"
import { JWTPayload } from "../types"



export function generateAccessToken(payload: JWTPayload): string {
    const secret = process.env.JWT_SECRET

    if (!secret) {
        throw new Error("JWT_SECRET is not defined")
    }

    return jwt.sign(payload, secret, {
        expiresIn:(process.env.JWT_EXPIRES_IN || "15m") as SignOptions["expiresIn"]

    })
}


export function generateRefreshToken(payload: JWTPayload): string {
    const secret = process.env.REFRESH_TOKEN_SECRET

    if (!secret) {
        throw new Error("REFRESH_TOKEN_SECRET is not defined")
    }

    return jwt.sign(payload, secret, {
        expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN || "7d") as SignOptions["expiresIn"]
    })
}


export function verifyAccessToken(token: string): JWTPayload {
    const secret = process.env.JWT_SECRET

    if (!secret) {
        throw new Error("JWT_SECRET is not defined")
    }

    try {
        const decoded = jwt.verify(token, secret) as JWTPayload
        return decoded
    } catch (error) {
        throw new Error("Invalid or expired token")
    }
}


export function verifyRefreshToken(token: string): JWTPayload {
    const secret = process.env.REFRESH_TOKEN_SECRET

    if (!secret) {
        throw new Error("REFRESH_TOKEN_SECRET is not defined")
    }

    try {
        const decoded = jwt.verify(token, secret) as JWTPayload
        return decoded
    } catch (error) {
        throw new Error("Invalid or expired refresh token")
    }
}