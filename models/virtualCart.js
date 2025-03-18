const mongoose = require("mongoose");

const VirtualCartSchema = new mongoose.Schema({
  cartId: { type: String, default: "123456789" },
  cardId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Prevent overwriting the model if already compiled
const VirtualCart = mongoose.models.VirtualCart || mongoose.model("VirtualCart", VirtualCartSchema);

module.exports = VirtualCart;
