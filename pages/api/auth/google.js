import prisma from "../../../lib/db";
import { generateToken } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

    const { credential, mode } = req.body;

    if (!credential) {
      return res.status(400).json({ error: "Missing Google credential token" });
    }

    try {
      // Validate the token using Google's official tokeninfo HTTPS endpoint
      const googleRes = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
      );

      if (!googleRes.ok) {
        return res.status(400).json({ error: "Invalid Google token signature or expired." });
      }

      const payload = await googleRes.json();
      const { email, name, sub: googleId } = payload;

      if (!email) {
        return res.status(400).json({ error: "Unable to retrieve email from Google profile." });
      }

      // Find user matching the Google SSO email
      let user = await prisma.user.findUnique({ where: { email } });

      if (mode === "login") {
        if (!user) {
          return res.status(404).json({ error: "Account not found. Please register first." });
        }
        // Link Google ID if not already linked
        if (!user.googleId) {
          user = await prisma.user.update({
            where: { email },
            data: { googleId, isVerified: true }
          });
        }
      } else if (mode === "signup") {
        if (user) {
          return res.status(409).json({ error: "Account already exists. Please sign in instead." });
        }
        // Create a new verified user for Google SSO
        user = await prisma.user.create({
          data: {
            email,
            name,
            googleId,
            isVerified: true
          }
        });
      } else {
        // Fallback for older frontend iterations (link or create)
        if (user) {
          if (!user.googleId) {
            user = await prisma.user.update({
              where: { email },
              data: { googleId, isVerified: true }
            });
          }
        } else {
          user = await prisma.user.create({
            data: {
              email,
              name,
              googleId,
              isVerified: true
            }
          });
        }
      }

    const token = generateToken(user);

    return res.status(200).json({
      message: "Google sign-in successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error("[Google OAuth Error]:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
