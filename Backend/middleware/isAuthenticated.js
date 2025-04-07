import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import User from "../models/userModel.js";

const isAuthenticated = catchAsync(async (req, res, next) => {
    const token = req.cookies.jwt || req.headers.authorization.split(" ")[1];
    if(!token){
        return next(new AppError("You are not logged in! Please log in to get access.", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        return next(new AppError("The user belonging to this token does no longer exist.", 401));
    }
    req.user = currentUser;
    next();
});

export default isAuthenticated;
