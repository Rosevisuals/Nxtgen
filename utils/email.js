// utils/email.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  // For a real application, you would use a professional service like SendGrid, Mailgun, etc.
  // For this example, we'll use a generic SMTP setup. You would get these credentials
  // from your email provider and store them securely in your .env file.
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Note: If you are using a service like Gmail, you might need to
    // configure "less secure app access" or use an "app password".
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'HOSPITAL ERP SYSTEM <no-reply@hospital-erp.com>',
    to: options.to,
    subject: options.subject,
    text: options.text,
    // html: options.html // You can also pass HTML content
  };

  // 3) Actually send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', options.to);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending email to:', options.to, error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;