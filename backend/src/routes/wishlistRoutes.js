const router = require("express").Router();
const { auth } = require("../middlewares/authMiddleware");
const wishlistCtrl = require("../controllers/wishlistController");

router.get("/", auth, wishlistCtrl.getWishlist);
router.post("/toggle", auth, wishlistCtrl.toggleWishlist);
router.delete("/clear", auth, wishlistCtrl.clearWishlist);

module.exports = router;
