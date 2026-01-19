module.exports = (err, req, res, next) => {
  console.error("Error:", err && err.message ? err.message : err);
  if (err && err.stack) console.error(err.stack);

  // If it's a Mongoose timeout error
  if (err.message && (err.message.includes("selection timed out") || err.message.includes("timed out"))) {
    return res.status(503).json({ 
      message: "Database connection timeout. Please check your network or MongoDB Atlas IP whitelist.",
      error: err.message 
    });
  }

  res.status(500).json({ message: err.message || "Server error" });
};
