import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    products: [{
        type: mongoose.ObjectId,
        ref: 'Products',
    },
    ],
    payment: {},
    buyer: {
        type: mongoose.ObjectId,
        ref:'users'
    },
    status: {
        type: String,
        default: 'Not Processed',
        enum:["Not Processed","Processing","Shipped","Out for Delivery","Delieverd","Cancel"],
    },
},{timestamps:true});
export default mongoose.model("order", orderSchema); 