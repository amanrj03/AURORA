import prisma from "../../../lib/db";
import { verifyToken, generateToken } from "../../../lib/auth";

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized. Missing session token." });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: "Unauthorized. Session token is invalid or expired." });
  }

  try {
    if (req.method === "GET") {
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          googleId: user.googleId,
          isVerified: user.isVerified,
          createdAt: user.createdAt
        }
      });
    }

    if (req.method === "POST") {
      const { name } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ error: "Name cannot be empty" });
      }

      const updatedUser = await prisma.user.update({
        where: { id: decoded.id },
        data: { name: name.trim() }
      });

      const newToken = generateToken(updatedUser);

      return res.status(200).json({
        message: "Profile updated successfully",
        token: newToken,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          isVerified: updatedUser.isVerified
        }
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("[Profile API Error]:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
