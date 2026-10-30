import nodemailer from "nodemailer";

export async function sendVerificationEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // or any email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationUrl = `${process.env.NEXTAUTH_URL}/action/auth/email-verification?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email",
    html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email. This link expires in 24 hours.</p>`,
  };

  await transporter.sendMail(mailOptions);
}
