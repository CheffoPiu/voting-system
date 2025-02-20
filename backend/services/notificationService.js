require('dotenv').config();
const nodemailer = require('nodemailer');
const twilio = require('twilio');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Enviar correo electrónico
 */
const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    };
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email enviado a ${to}`);
  } catch (err) {
    console.error("❌ Error al enviar correo:", err);
  }
};

// Configurar Twilio
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * Enviar SMS
 */
const sendSMS = async (to, message) => {
  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to
    });
    console.log(`📲 SMS enviado a ${to}`);
  } catch (err) {
    console.error("❌ Error al enviar SMS:", err);
  }
};

module.exports = { sendEmail, sendSMS };
