import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send an email
 * @param {Object} options - { to, subject, html, text }
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    console.log("========== EMAIL DEBUG ==========");
    console.log("Sending to:", to);
    console.log("SMTP Host:", process.env.SMTP_HOST);
    console.log("SMTP Port:", process.env.SMTP_PORT);
    console.log("SMTP User:", process.env.SMTP_USER);

    await transporter.verify();

    console.log("SMTP VERIFIED");
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      text,
    });
    
    console.log("EMAIL SENT");
    console.log(info);
    
  } catch (err) {
    console.error("EMAIL ERROR:");
    console.error(err);
  }
};
