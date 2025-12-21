const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendSellerCredentials = async (email, name, password) => {
  const mailOptions = {
    from: `"AMMOGAM Admin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to AMMOGAM - Your Seller Account is Approved',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #10b981; text-align: center;">Account Approved!</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>Congratulations! Your seller account application for <strong>AMMOGAM</strong> has been approved by our admin team.</p>
        <p>You can now log in to your dashboard using the following credentials:</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
        </div>
        <p style="color: #6b7280; font-size: 0.9em;">We recommend that you change your password after your first login.</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="background-color: #10b981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login Now</a>
        </div>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="text-align: center; color: #9ca3af; font-size: 0.8em;">© 2025 AMMOGAM. All rights reserved.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Credentials email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Error sending credentials email:', error);
    return false;
  }
};
