import prisma from "../../../lib/db";
import { hashPassword, sendOtpMail } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ error: "Email already registered and verified." });
      }
      
      // If user exists but is unverified, clear old record so they can register cleanly
      await prisma.user.delete({ where: { email } });
    }

    const hashedPassword = hashPassword(password);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // Transactionally create User and save OTP
    await prisma.$transaction([
      prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          isVerified: false
        }
      }),
      prisma.otp.create({
        data: {
          email,
          code: otpCode,
          type: "SIGNUP",
          expiresAt
        }
      })
    ]);

    await sendOtpMail({
      to: email,
      subject: "Verify your AURORA Account",
      text: `Welcome to AURORA! Your verification code is ${otpCode}. It expires in 15 minutes.`
    });

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("[Signup Error]:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
