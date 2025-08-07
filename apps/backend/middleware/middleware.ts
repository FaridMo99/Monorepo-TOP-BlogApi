import jwt from "jsonwebtoken";
import prisma from "../db/prismaClient";

//generate jwt
export function generateToken(userId: string) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY!, {
    expiresIn: "15min",
  });
}

//auth middleware
  //middleware already gets the user so ne need to get the
  //user again inside the controllers/routes
export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    //get token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not Authorized" });
    }
    try {
      //Decode to get id from payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);

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
