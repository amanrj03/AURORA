import prisma from "../../../lib/db";
import { comparePassword, generateToken, sendOtpMail } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const matches = comparePassword(password, user.password);

    if (!matches) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    if (!user.isVerified) {
      // Generate and resend a new OTP automatically
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      await prisma.otp.create({
        data: {
          email,
          code: otpCode,
          type: "SIGNUP",
          expiresAt
        }
      });

      await sendOtpMail({
        to: email,
        subject: "Verify your AURORA Account",
        text: `Your verification code is ${otpCode}. It expires in 15 minutes.`
      });

      return res.status(202).json({
        needsVerification: true,
        email,
        message: "Your account is unverified. A new OTP has been sent."
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error("[Login Error]:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
