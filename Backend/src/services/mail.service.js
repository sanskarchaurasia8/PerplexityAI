import nodemailer from "nodemailer";

const hasEmailConfig = Boolean(
  process.env.GOOGLE_USER &&
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_REFRESH_TOKEN
);

let transporter = null;
if (hasEmailConfig) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GOOGLE_USER,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      clientId: process.env.GOOGLE_CLIENT_ID,
    },
  });

  transporter
    .verify()
    .then(() => {
      console.log("Email transporter is ready to send emails");
    })
    .catch((err) => {
      console.error("Email transporter verification failed:", err);
    });
} else {
  console.warn("Email service is not configured, skipping email sends.");
}

export async function sendEmail({ to, subject, html, text }) {
  if (!transporter) {
    console.warn("sendEmail skipped because transporter is not configured.");
    return;
  }

  const mailOptions = {
    from: process.env.GOOGLE_USER,
    to,
    subject,
    html,
    text,
  };

  const details = await transporter.sendMail(mailOptions);
  console.log("Email sent:", details);
}