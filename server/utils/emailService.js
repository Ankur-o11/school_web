import nodemailer from "nodemailer";

/**
 * Utility to send emails via SMTP (or log when unconfigured)
 */
export async function sendEmail({ to, subject, html, text }) {
  if (!to) {
    return { success: false, error: "Recipient email address is missing." };
  }

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const from = process.env.SMTP_FROM || `"MPSA School Admissions" <admissions@mpsa.com>`;

  // If SMTP is not fully configured, log to console gracefully and return simulated success
  if (!host || !user || !pass) {
    console.log(`[Email Service Simulation] To: ${to} | Subject: ${subject}`);
    console.log(`[Email Content]\n${text || html}`);
    return {
      success: true,
      simulated: true,
      message: "Email logged to console (SMTP credentials not configured in server.env).",
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html: html || text,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (err) {
    console.error("[Email Dispatch Error]:", err);
    return {
      success: false,
      error: err.message || "Failed to send email.",
    };
  }
}
