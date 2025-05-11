const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'abdulrazaqmussab1@gmail.com',
    pass: 'Pass123444' 
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
