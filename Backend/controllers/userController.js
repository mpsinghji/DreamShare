import catchAsync from "../utils/catchAsync.js";
import User from "../models/userModel.js";

export const getProfile = catchAsync(async (req, res, next) => {
    const { id } = req.user;
    const user = await User.findById(id)
        .select("-password -otp -otpExpires -resetPasswordOtp -resetPasswordOTPExpires -passwordConfirm")
        .populate({
            path:"post",
            options:{
                sort: {createdAt: -1},
            }
        })
        .populate({
            path:"savedPost",
            options:{
                sort: {createdAt: -1},
            }
        });
        
        if(!user){
            return next(new AppError("User not found", 404));
        }

        res.status(200).json({
            status: "success",
            data: user,
        });
});

