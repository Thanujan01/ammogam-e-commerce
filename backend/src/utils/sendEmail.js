const nodemailer = require("nodemailer");

const isProduction = process.env.NODE_ENV === "production";

const createTransporter = async () => {
  const hasAuth = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

  if (!hasAuth) {
    if (isProduction) {
      throw new Error("Email service is not configured. Set EMAIL_USER and EMAIL_PASS.");
    }

    // Local/dev fallback: accept mails without external SMTP so forgot-password flow can be tested.
    return nodemailer.createTransport({ jsonTransport: true });
  }

  if (process.env.EMAIL_HOST && process.env.EMAIL_PORT) {
    const port = Number(process.env.EMAIL_PORT);
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendEmail = async (options) => {
  const transporter = await createTransporter();

  const message = {
    from: `${process.env.FROM_NAME || 'Ammogam Support'} <${process.env.FROM_EMAIL || process.env.EMAIL_USER || 'no-reply@ammogam.local'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(message);

  if (!isProduction && info && info.message) {
    console.log("BACKEND DEBUG: Email captured in local json transport.");
  }
};

module.exports = sendEmail;
