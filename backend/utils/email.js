const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'abdulrazaq@gmail.com',
    pass: 'Pass123444' // use App Passwords, not your real password
  }
});

async function sendMatchReminderEmail(to, subject, htmlContent) {
  const mailOptions = {
    from: '"KFUPM Tournament" <your_email@gmail.com>',
    to,
    subject,
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

module.exports = { sendMatchReminderEmail };
