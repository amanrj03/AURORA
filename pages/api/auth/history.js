import prisma from "../../../lib/db";
import { verifyToken } from "../../../lib/auth";

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
    // 1. GET: Retrieve user's query history (limit 10)
    if (req.method === "GET") {
      const logs = await prisma.history.findMany({
        where: { userId: decoded.id },
        orderBy: { createdAt: "desc" },
        take: 10
      });
      return res.status(200).json(logs);
    }

    // 2. POST: Insert new history log
    if (req.method === "POST") {
      const { company, risk, result } = req.body;

      if (!company || !risk || !result) {
        return res.status(400).json({ error: "Missing required query payload." });
      }

      // Check if duplicate company exists for user, delete old to make it recent
      const duplicate = await prisma.history.findFirst({
        where: {
          userId: decoded.id,
          company
        }
      });

      if (duplicate) {
        await prisma.history.delete({ where: { id: duplicate.id } });
      }

      const newLog = await prisma.history.create({
        data: {
          userId: decoded.id,
          company,
          risk,
          result
        }
      });

      return res.status(200).json(newLog);
    }

    // 3. DELETE: Clear history list
    if (req.method === "DELETE") {
      await prisma.history.deleteMany({
        where: { userId: decoded.id }
      });
      return res.status(200).json({ message: "History cleared successfully." });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("[History API Error]:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
