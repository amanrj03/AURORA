import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET || "aurora-secure-default-jwt-secret";

export function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, isVerified: user.isVerified },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

/**
 * Sends mail via SMTP or falls back to server console logs if SMTP details are missing.
 */
export async function sendOtpMail({ to, subject, text }) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || "AURORA Support <support@aurora-invest.com>";

  if (host && port && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port: parseInt(port),
        secure: parseInt(port) === 465,
        auth: { user, pass }
      });
      await transporter.sendMail({ from, to, subject, text });
      return true;
    } catch (e) {
      console.error("[SMTP Error] Failed sending real email:", e.message);
    }
  }

  // Fallback Dev Logging
  console.log("\n========================================================");
  console.log(`[DEVELOPMENT MODE - EMAIL REDIRECT]`);
  console.log(`To:      ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${text}`);
  console.log("========================================================\n");
  return true;
}
