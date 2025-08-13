import jwt from "jsonwebtoken";
import prisma from "../db/prismaClient";
import { Request, Response, NextFunction } from "express";
import { User } from "../generated/prisma";

export interface Decoded extends jwt.JwtPayload {
  id: string;
}

//auth middleware
//middleware already gets the user so need to get the
//user again inside the controllers/routes
export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    //get token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not Authorized" });
    }
    try {
      //Decode to get id from payload
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET_KEY!
      ) as Decoded;

      //check if tampered token
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      //add to request obj for next piece of middleware
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
}

export function adminAuthorizationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { isAdmin } = req.user as User;
  if (!isAdmin) return res.status(401).json({ message: "Unauthorized" });
  next();
}

export function sameUserAuthorization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.user as User;
  const { userId } = req.params;
  if (id !== userId) return res.status(401).json({ message: "Unauthorized" });
  next();
}