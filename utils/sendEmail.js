module.exports = async function sendEmail(to, content) {
  console.log(`Simulated email to ${to}: ${content}`);
};
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // or your email provider
  auth: {
    user: process.env.EMAIL_USER, // your email address
    pass: process.env.EMAIL_PASS, // your email password or app password
  },
});

module.exports = async function sendEmail(to, content) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Your Password Reset Code",
    text: content,
  });
};