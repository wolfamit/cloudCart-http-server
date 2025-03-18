
const mongoose = require("mongoose")

const VirtualCartSchema = new mongoose.Schema({
  cartId: { type: String , default : "123456789"},
  cardId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const VirtualCart = mongoose.model("VirtualCart", VirtualCartSchema);
module.exports = VirtualCart