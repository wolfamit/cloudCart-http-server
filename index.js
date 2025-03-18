const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const {Cart} = require('./model');
const {Item} = require('./model');
const connectDB = require('./db'); // Import DB connection
const VirtualItems = require('./models/virtualCart.js');

// Initialize Express app
const app = express();
app.use(express.json({limit: "30mb" , extended: "true"}));
app.use(cors({origin:true}))

// app.use('/' , async (req , res) => {
//     res.status(200).send("Hello CloudCart")
// })

// ✅ POST - Authorize and Update Cart Details
app.post('/authorize/:cart_id', async (req, res) => {
        const { cart_id } = req.params;
        const { cell, customerName } = req.body;
    
        if (!cart_id || !customerName) {
            return res.status(400).json({ status:"error", message: 'Missing required fields' });
        }
    
        try {
            // Step 1: Check if the cart exists (Authorize)
            const cart = await Cart.findOne({ cartID: cart_id });
            if (!cart) {
                return res.status(401).json({ status: 'error', message: 'Unauthorized: Cart ID not found' });
            }
            // Step 2: Update cart details
            cart.cell = cell;
            cart.occupied = true;
            cart.customerName = customerName;
            cart.timestamp = new Date();
            await cart.save(); // Save the changes
    
            res.status(200).json({
                status: 'success',
                cartID: cart.cartID,
                cell: cart.cell,
                customerName,
                items : cart.items,
                timestamp: cart.timestamp.toISOString()
            });
        } catch (error) {
            console.error("Error updating cart:", error);
            res.status(500).json({ status: error, message: 'Internal Server Error' });
        }
    });

//  Create a New Cart Entry
app.post('/update/:cart_id', async (req, res) => {
    const { cart_id } = req.params;

    if (!cart_id || cart_id.trim() === "") {
        return res.status(400).json({ status: 'error', message: "Invalid cart ID" });
    }

    try {
        const newCart = await Cart.create({ cartID: cart_id, occupied: false });

        res.status(200).json({
            status: 'success',
            message: "Cart ID created",
            cartID: newCart.cartID,
            occupied: newCart.occupied,
            timestamp: newCart.timestamp.toISOString()
        });
    } catch (error) {
        console.error("Error creating cart:", error);
        res.status(500).json({ status: error, message: 'Internal Server Error' });
    }
});


// add items to the DB 
app.post('/v2/update/item' , async (req, res) => {
    const { card_id , item_name , description , price ,  discounted_price , url , color} = req.body;
    if (!card_id ) {
        return res.status(404).json({ status: "error", message: "Item Invalid card Id" });
    }
    try {
        newItem = await Item.create({
            card_id: card_id,
            item_name: item_name || "T-Shirt",
            description: description ||  "Premium cotton t-shirt",
            price: price || 799,
            discounted_price: discounted_price || 599,
            url: url || "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.flipkart.com%2Ffastb-printed-men-round-neck-black-t-shirt%2Fp%2Fitme1e2531fe55e5&psig=AOvVaw0qKbE1koXHz8a3y2WkwtT4&ust=1740731667928000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPDfnfq444sDFQAAAAAdAAAAABAJ",
            size: "L",
            color: color || "Blue"
        });
        return res.status(200).json({ status: 'success', message: "Success", newItem });
    } catch (error) {
        console.error("Error creating cart:", error);
        res.status(500).json({ status: error, message: 'Internal Server Error' });
    }
});

// push to User's Cart
app.post('/v2/pushToVirtual' , async (req, res) => {
    const { card_id } = req.body;
    if (!card_id ) {
        return res.status(400).json({ status: 'error', message: "Invalid card ID" });
    }
    try {
        const item = await Item.findOne({card_id : card_id});
        if(!item){
            return res.status(404).json({ status: 'error', message: 'Item Not Found' });
        }
        
        const push = await VirtualItems.create({
            cardId : card_id,
            cartId : 123456789
        })
        await push.save();
        return res.status(200).json({ status: 'success', message: "Success", push , item });
    } catch (error) {
        console.error("Error creating cart:", error);
        return res.status(500).json({ status: error, message: 'Internal Server Error' });
    }
});

app.post('/getItems/:id' , async (req , res) => {
    try {
        const { id } = req.params;
        if(!id){
            return res.status(404).send({ success: false, message: "Id not found" });
        }
        const cart = await Cart.findOne({ cartID: id });
        if (!cart) {
            return res.status(404).send({ success: false, message: "Cart not found" });
        }
        const items = await VirtualItems.findOne({ cartId: id });
        if (!items || items.length === 0) {
            return res.status(404).send({ success: false, message: "No items found" });
        }
        const item = await Item.findOne({card_id : items.cardId})
        return res.status(200).send({ success: true, item });
    } catch (error) {
        console.log(error)
        return res.status(500).send({success : false , message : "Server Error" , error : error});
    }
})

connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
