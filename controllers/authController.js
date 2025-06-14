import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from 'jsonwebtoken';

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body
        // validation
        if (!name) {
            return res.send({message:"Name is required"})
        }
        if (!email) {
            return res.send({message:"Email is required"})
        }
        if (!password) {
            return res.send({message:"Password is required"})
        }
        if (!phone) {
            return res.send({message:"Phone is required"})
        }
        if (!address) {
            return res.send({message:"Address is required"})
        }
        if (!answer) {
            return res.send({message:"Answer is required"})
        }

        // check user
        const existingUser = await userModel.findOne({ email })
        
        // Existing User check
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Already Register please login",
            });
        }
        // register user
        const hashedPassword = await hashPassword(password)
        // save
        const user = await new userModel({ name, email, phone, address, password: hashedPassword, answer}).save()
        res.status(201).send({
            success: true,
            message: "User Register Successfully",
            user,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Register",
            error
        });
    }
 };

//  POST LOGIN
export const loginController = async (req, res) => { 
    try {
        const { email, password } = req.body
        // validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message:"Invalid email or password"
            })
        }
        // check user
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message:"Email is not registered"
            }) 
        }
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid email or password"
            })
        }
        // token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).send({
            success: true,
            message: "Login successfully",
            user: {
                _id:user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role:user.role,
            },
            token
        }) 
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in login",
            error
        })
    }
};


// forgotPasswordController
export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body
        if (!email) { 
            res.status(400).send({message:'Email is required'})
        }
        if (!answer) { 
            res.status(400).send({message:'answer  is required'})
        }
        if (!newPassword) { 
            res.status(400).send({message:'New Password is required'})
        }
        // check
        const user = await userModel.findOne({ email, answer })
        // validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message:"Wrong Email or Answer"
            })
        }
        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id, { password: hashed })
        res.status(200).send({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error
        })
    }
};

// testController

export const testController = (req, res) => {
    res.send("Protected Route "); 
};

// update profile
export const updateProfileController = async (req, res) => {
    console.log("updateProfileController triggered", req.body);
    try {
        const { name, email, password, address, phone } = req.body
        console.log("=== Update Profile Request ===");
        console.log("req.user:", req.user);  // Info from token (set by requireSignIn middleware)
        console.log("Request body:", { name, email, password, address, phone });
        const user = await userModel.findById(req.user._id)
        // password
        if (password && password.length < 6) {
            return res.json({error:"Password is required and 6 character long"})
        }
        const hashedPassword = password ? await hashPassword(password):undefined
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address : address || user.address
        }, { new: true })
        res.status(200).send({
            success: true,
            message: "Profile Updated Successfully",
            updatedUser,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error while update profile",
            error
        })
        
    }
}

// orders
export const getOrdersController = async (req,res) => {
    try {
        const orders = await orderModel.find({ buyer: req.user._id }).populate("products", "-photo").populate("buyer", "name")
        res.json(orders)
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting Orders",
            error
        })
    }
};
 
// all orders
export const getAllOrdersController = async (req,res) => {
    try {
        const orders = await orderModel.find({})
            .populate("products", "-photo")
            .populate("buyer", "name")
            .sort({createdAt:-1})
        res.json(orders)
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting Orders",
            error
        })
    }
};
 

// order Sttaus
export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params
        const { status } = req.body
        const orders = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true })
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'error while updating',
            error
        })
        
    }
}