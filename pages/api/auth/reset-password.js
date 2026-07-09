import prisma from "../../../lib/db";
import { hashPassword } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const activeOtp = await prisma.otp.findFirst({
      where: {
        email,
        code,
        type: "PASSWORD_RESET",
        expiresAt: { gt: new Date() }
      }
    });

    if (!activeOtp) {
      return res.status(400).json({ error: "Invalid or expired password reset code." });
    }

    const hashedPassword = hashPassword(newPassword);

    // Transactionally update password and delete OTP
    await prisma.$transaction([
      prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          isVerified: true // Automatically mark verified if they can reset
        }
      }),
      prisma.otp.delete({
        where: { id: activeOtp.id }
      })
    ]);

    return res.status(200).json({ message: "Password updated successfully. You can now log in." });
  } catch (error) {
    console.error("[Reset Password Error]:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
