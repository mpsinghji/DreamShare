import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema=new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add your name"],
        trim: true,
        maxlength: [50, "Name cannot be more than 50 characters"],
    },
    username: {
        type:String,
        requied: [true,"Please add username"],
        unique: true,
        trim: true,
        minlenght: 3,
        maxlenght: 30,
        index: true,
    },
    email:{
        type: String,
        required: [true, "Please add email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please add a valid email"],
    },
    password:{
        type: String,
        required: [true, "Please add password"],
        minlength: 8,
        select: false,
    },
    passwordConfirm:{
        type: String,
        required: [true, "Please confirm password"],
        validate: {
            validator: function(el){
                return el===this.password;
            },
            message: "Passwords are not the same",
        }
    },
    profilePicture:{
        type: String,
    },
    bio:{
        type: String,
        maxlength: 150,
        default: "",
    },
    followers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    following:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    posts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        }
    ],
    savedPosts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        }
    ],
    isVerified:{
        type: Boolean,
        default: false,
    },
    otp:{
        type: String,
        default: null,
    },
    otpExpiry:{
        type: Date,
        default: null,
    },
    resetPasswordOTP:{
        type: String,
        default: null,
    },
    resetPasswordOTPExpires:{
        type: Date,
        default: null,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    passwordChangedAt: Date,
}, {timestamps: true});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,12);
    this.passwordConfirm=undefined;
    next();
}); 

userSchema.methods.correctPassword=async function(userPassword,databasePassword){
    return await bcrypt.compare(userPassword,databasePassword);
};

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

const User=mongoose.model("User",userSchema);
export default User;