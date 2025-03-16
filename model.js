const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    cartID: { type: String, required: true, unique: true },  // Unique identifier for the cart
    occupied: { type: Boolean, default: false },             // True if the cart is in use, False otherwise
    cell: { type: String, default: "" }, 
    items: {type : Array },
    customerName : { type: String, default: "Super Admin" },                    // Cell location (can be updated later)
    timestamp: { type: Date, default: Date.now }             // Auto-generated timestamp
});

const Cart = mongoose.model('Cart', cartSchema);


const itemSchema = new mongoose.Schema({
    card_id: {
        type: String,
        required: true
    },
    item_name: {
        type: String,
        required: false
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: false
    },
    discounted_price: {
        type: Number,
        required: false
    },
    url: {
        type: String // URL to the item image or page
    },
    size: {
        type: String,
        default: "M",
        enum: ["XS", "S", "M", "L", "XL", "XXL"]
    },
    color: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = { Cart, Item };