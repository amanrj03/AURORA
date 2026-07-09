import prisma from "../../../../lib/db";
import { generateToken } from "../../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Missing email or code" });
  }

  try {
    const activeOtp = await prisma.otp.findFirst({
      where: {
        email,
        code,
        type: "SIGNUP",
        expiresAt: { gt: new Date() }
      }
    });

    if (!activeOtp) {
      return res.status(400).json({ error: "Invalid or expired verification code." });
    }

    // Transactional verify: delete OTP and verify user
    const [user] = await prisma.$transaction([
      prisma.user.update({
        where: { email },
        data: { isVerified: true }
      }),
      prisma.otp.delete({
        where: { id: activeOtp.id }
      })
    ]);

    const token = generateToken(user);

    return res.status(200).json({
      message: "Verification successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error("[OTP Verify Error]:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
