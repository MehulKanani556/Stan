import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});

function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  return /.+@.+\..+/.test(email);
}

async function sendMail(to, subject, text) {
  if (!isValidEmail(to)) {
    throw new Error("No valid recipient email provided");
  }
  if (!subject || !text) {
    throw new Error("Email subject and body are required");
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html: text,
  };

  return transporter.sendMail(mailOptions);
}

export default sendMail;
