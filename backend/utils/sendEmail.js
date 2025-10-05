const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Create transporter
    // 💡 FIX: Changed the function name from createTransporter to createTransport
    const transporter = nodemailer.createTransport({ 
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email options
    const mailOptions = {
      from: `"Breakfast4U" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    // Note: Throwing the error here will likely cause the server to crash
    // if not handled in authController. You may want to handle it 
    // without re-throwing if you want the main process to continue.
    throw error; 
  }
};

// Email templates
const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to Breakfast4U!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f97316;">Welcome to Breakfast4U, ${name}!</h2>
        <p>Thank you for joining our community of breakfast lovers.</p>
        <p>Start exploring delicious breakfast options in your area and discover your perfect morning meal!</p>
        <div style="background-color: #f97316; color: white; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
          <h3>Get Started</h3>
          <p>Browse our menu and find stores near you</p>
        </div>
        <p>Best regards,<br>The Breakfast4U Team</p>
      </div>
    `
  }),

  contactConfirmation: (name, subject) => ({
    subject: 'We received your message - Breakfast4U',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f97316;">Thank you for contacting us, ${name}!</h2>
        <p>We have received your message regarding: <strong>${subject}</strong></p>
        <p>Our team will review your inquiry and get back to you within 24 hours.</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>What's next?</strong></p>
          <ul>
            <li>We'll review your message</li>
            <li>A team member will respond within 24 hours</li>
            <li>You'll receive a detailed response via email</li>
          </ul>
        </div>
        <p>Best regards,<br>The Breakfast4U Support Team</p>
      </div>
    `
  }),

  orderConfirmation: (orderNumber, items, total) => ({
    subject: `Order Confirmation - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f97316;">Order Confirmed!</h2>
        <p>Your order <strong>${orderNumber}</strong> has been confirmed.</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Order Details:</h3>
          <ul>
            ${items.map(item => `<li>${item.quantity}x ${item.name} - ₹${item.price}</li>`).join('')}
          </ul>
          <hr>
          <p><strong>Total: ₹${total}</strong></p>
        </div>
        <p>We'll notify you when your order is ready!</p>
        <p>Best regards,<br>The Breakfast4U Team</p>
      </div>
    `
  })
};

module.exports = { sendEmail, emailTemplates };