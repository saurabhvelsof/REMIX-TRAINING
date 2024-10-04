// app/utils/email.server.js
import nodemailer from "nodemailer";

export async function sendVerificationEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Use your email provider
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or app password
    },
  });

  const verificationLink = `${process.env.BASE_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: '"My App" <no-reply@example.com>',
    to: email,
    subject: "Email Verification",
    html: `
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationLink}">Verify Email</a>
    `,
  });
}
