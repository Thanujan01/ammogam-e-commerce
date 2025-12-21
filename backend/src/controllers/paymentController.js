const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");
const Product = require("../models/Product");
const emailService = require("../services/emailService");
const User = require("../models/User");

exports.createCheckoutSession = async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
       console.error("CRITICAL: STRIPE_SECRET_KEY is missing in .env");
       return res.status(500).json({ message: "Payment configuration error" });
    }
    
    const { orderId } = req.body;
    
    // Determine the frontend origin for redirects
    const origin = req.get('origin') || req.get('referer')?.split('/').slice(0, 3).join('/') || "http://localhost:5173";
    
    // Determine the backend base URL for images
    const protocol = req.headers["x-forwarded-proto"] || req.protocol;
    const host = req.get('host');
    const backendBaseUrl = `${protocol}://${host}`;

    console.log("Creating checkout session for Order ID:", orderId);
    
    const order = await Order.findById(orderId).populate("items.product");

    if (!order) {
      console.log("Order logic error: Order not found in DB");
      return res.status(404).json({ message: "Order not found" });
    }
    console.log("Order found. Item count:", order.items.length);

    const line_items = order.items
      .filter(item => item.product)
      .map((item) => {
        const productImage = item.product.image;
        
        // Stripe requires absolute HTTPS URLs for images. 
        // localhost is generally not allowed unless tunnelled (like Ngrok).
        // If we are on localhost, we shouldn't send images to Stripe.
        const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
        const images = (productImage && !isLocal) 
          ? [`${backendBaseUrl}/uploads/${productImage}`] 
          : [];

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.product.name || "Unnamed Product",
              images: images,
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        };
      });

    if (line_items.length === 0) {
      return res.status(400).json({ message: "No valid items found in order" });
    }

    // Add shipping as a line item
    const sFee = Number(order.shippingFee) || 0;
    if (sFee > 0) {
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping Fee",
          },
          unit_amount: Math.round(sFee * 100),
        },
        quantity: 1,
      });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: `${origin}/order-success/${orderId}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/payment-failed/${orderId}`,
            metadata: {
                orderId: orderId.toString(),
            },
        });
        console.log("Stripe Session Created Successfully:", session.id);
        res.json({ id: session.id, url: session.url });
    } catch (stripeErr) {
        console.error("STRIPE API ERROR:", stripeErr.message);
        res.status(400).json({ message: `Stripe Error: ${stripeErr.message}` });
    }
  } catch (error) {
    console.error("General Payment Controller Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { session_id, orderId } = req.body;
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === 'paid') {
                // Fetch full order to update status and send email
                const order = await Order.findById(orderId)
                  .populate('user', 'name email')
                  .populate('items.product');

                if (order) {
                    order.paymentStatus = 'paid';
                    order.status = 'processed';
                    await order.save();
                    
                    // Send Confirmation Email
                    if (order.user && order.user.email) {
                        await emailService.sendOrderConfirmation(order, order.user);
                    }
                    return res.json({ success: true, message: "Payment verified" });
                }
        }
        res.status(400).json({ success: false, message: "Payment not verified" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
