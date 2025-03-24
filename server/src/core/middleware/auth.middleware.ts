import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { User } from "../../core/database/models/user.model";
import { ApiError } from "../errors/api.error";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new ApiError(401, "Authentication token missing");
    }

    const decoded = verifyToken(token) as { userId: string };
    if (!decoded?.userId) {
      throw new ApiError(401, "Invalid authentication token");
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      roles: user.roles,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(401).json({ error: "Authentication failed" });
  }
};
