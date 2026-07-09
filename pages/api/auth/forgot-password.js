import prisma from "../../../lib/db";
import { sendOtpMail } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Missing email address" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    // For security we say success regardless, but let's log internally
    if (!user) {
      console.warn(`[Forgot Password] Requested email not found: ${email}`);
      return res.status(200).json({ message: "If your email is registered, a reset code was sent." });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await prisma.otp.create({
      data: {
        email,
        code: resetCode,
        type: "PASSWORD_RESET",
        expiresAt
      }
    });

    await sendOtpMail({
      to: email,
      subject: "AURORA Password Reset Code",
      text: `Your password reset code is ${resetCode}. If you did not request this, please ignore this email.`
    });

    return res.status(200).json({ message: "If your email is registered, a reset code was sent." });
  } catch (error) {
    console.error("[Forgot Password Error]:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
