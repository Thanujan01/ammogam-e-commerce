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

exports.sendOrderConfirmation = async (order, user) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: `"AMMOGAM Store" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `Order Confirmation - #${order._id.toString().slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #10b981; text-align: center;">Order Confirmed!</h2>
        <p>Dear <strong>${user.name}</strong>,</p>
        <p>Thank you for your purchase! We have received your order and it is being processed.</p>
        
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order._id.toString().slice(-8).toUpperCase()}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p style="margin: 5px 0;"><strong>Payment Status:</strong> <span style="color: ${order.paymentStatus === 'paid' ? 'green' : 'orange'}">${order.paymentStatus.toUpperCase()}</span></p>
           <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        </div>

        <h3 style="border-bottom: 2px solid #10b981; padding-bottom: 5px; margin-bottom: 10px;">Order Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Subtotal:</td>
              <td style="padding: 10px; text-align: right;">$${(order.totalAmount - (order.shippingFee || 0)).toFixed(2)}</td>
            </tr>
             <tr>
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Shipping:</td>
              <td style="padding: 10px; text-align: right;">$${(order.shippingFee || 0).toFixed(2)}</td>
            </tr>
            <tr style="background-color: #f0fdf4;">
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; color: #10b981;">Total:</td>
              <td style="padding: 10px; text-align: right; font-weight: bold; color: #10b981;">$${order.totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <div style="margin-top: 20px;">
          <h4 style="margin-bottom: 5px;">Shipping Address:</h4>
          <p style="color: #4b5563; margin: 0;">
            ${order.shippingAddress.name}<br>
            ${order.shippingAddress.address}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
            Phone: ${order.shippingAddress.phone}
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders/${order._id}" style="background-color: #10b981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Order</a>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="text-align: center; color: #9ca3af; font-size: 0.8em;">© 2025 AMMOGAM. All rights reserved.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return false;
  }
};
