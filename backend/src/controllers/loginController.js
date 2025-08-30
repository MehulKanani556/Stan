import User from "../models/userModel.js";
import { ThrowError } from "../utils/ErrorUtils.js"
import bcrypt from "bcryptjs";
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendUnauthorizedResponse } from '../utils/ResponseUtils.js';
import nodemailer from "nodemailer"
import twilio from 'twilio';
import { encryptData } from "../middlewares/incrypt.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

const phoneNoOtp = async (contactNo, otp) => {
    let formattedContactNo = contactNo.toString().replace(/\D/g, '');
    if (formattedContactNo.length === 10) {
        formattedContactNo = `+91${formattedContactNo}`;
    } else if (formattedContactNo.length === 12 && formattedContactNo.startsWith('91')) {
        formattedContactNo = `+${formattedContactNo}`;
    } else {
        console.error("Invalid contactNo format. Please provide a valid 10-digit Indian contactNo.");
        return false;
    }
    // Twilio
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;
    if (!accountSid || !authToken || !fromPhone) {
    }
    const client = twilio(accountSid, authToken);
    try {
        await client.messages.create({
            body: `Your verification code is: ${otp}. Valid for 5 minutes.`,
            to: formattedContactNo,
            from: fromPhone
        });
        return true;
    } catch (twilioError) {
        console.log(`SMS sending failed: ${twilioError.message}`);
        return false;
    }
}

// Utility to send OTP to email
async function sendOtpEmail(email, otp) {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MY_GMAIL,
            pass: process.env.MY_PASSWORD,
        },
        tls: { rejectUnauthorized: false },
    });

    const mailOptions = {
        from: process.env.MY_GMAIL,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
}

const generateTokens = async (id) => {
    try {
        const userData = await User.findOne({ _id: id });
        if (!userData) {
            throw new Error("User not found");
        }

        const accessToken = await jwt.sign(
            {
                _id: userData._id,
                role: userData.role || "user",
                isAdmin: userData.role === "admin"
            },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        const refreshToken = await jwt.sign(
            {
                _id: userData._id,
                role: userData.role || "user",
                isAdmin: userData.role === "admin"
            },
            process.env.REFRESH_SECRET_KEY,
            { expiresIn: "15d" }
        );

        userData.refreshToken = refreshToken;
        await userData.save({ validateBeforeSave: false });

        return {
            accessToken: accessToken, // Encrypt accessToken
            refreshToken: userData.refreshToken, // Already encrypted
        };
    } catch (error) {
        throw new Error(error.message);
    }
};


export const userLogin = async (req, res) => {
    try {
        const { email, password, contactNo } = req.body;

        const emailHash = email ? encryptData(email) : undefined;
        const contactNoHash = contactNo ? encryptData(contactNo) : undefined;

        // 1. Contact Number Login (OTP)
        if (contactNo || !email && !password) {
            // Check if user exists with this contactNo
            const user = await User.findOne({ contactNo: contactNoHash });
            if (!user) {
                return sendErrorResponse(res, 404, "User not found with this contact number");
            }

            // Generate OTP (e.g., 6 digit random number)
            const otp = generateOTP();

            // Set OTP and expiry (e.g., 5 minutes from now)
            user.otp = otp;
            user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
            await user.save();

            // Send OTP to contactNo (use original, not encrypted)
            const smsSent = await phoneNoOtp(contactNo, otp);
            if (!smsSent) {
                return sendErrorResponse(res, 500, "Failed to send OTP via SMS");
            }

            return sendSuccessResponse(res, "OTP sent to contact number", { contactNo });
        }

        // 2. Email & Password Login
        if (!email || !password) {
            return sendBadRequestResponse(res, "Email and password are required");
        }

        const user = await User.findOne({ email: emailHash });
        if (!user) {
            return sendErrorResponse(res, 404, "User not found");
        }

        // Validate password (don't encrypt input password for comparison)
        const isPasswordValid = await user.validatePassword(password);
        console.log(isPasswordValid)   
        if (!isPasswordValid) {
            return sendUnauthorizedResponse(res, "Invalid password");
        }

        // Always update lastLogin on successful login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT token
        const { accessToken, refreshToken } = await generateTokens(user._id);

        if (!accessToken) {
            return sendErrorResponse(res, 500, "Failed to generate token");
        }

     
        return res
            .cookie("accessToken", accessToken, { httpOnly: true, secure: true, maxAge: 2 * 60 * 60 * 1000, sameSite: "Strict" })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 15 * 24 * 60 * 60 * 1000,
                sameSite: "Strict",
            })
            .status(201)
            .json({
                success: true,
                message: "Login successful",
                result: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role || 'user',
                    isAdmin: user.role === 'admin',
                    lastLogin: user.lastLogin,
                    token: accessToken
                }
            });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Verify contactno Otp
export const VerifyPhone = async (req, res) => {
    try {
        const { contactNo, otp } = req.body;

        if (!contactNo || !otp) {
            return sendBadRequestResponse(res, "Please provide contactNo and OTP.");
        }

        const contactNoHash = contactNo ? encryptData(contactNo) : undefined;

        const user = await User.findOne({
            $or: [
                { contactNo: contactNoHash },
                { contactNo: '+91' + contactNoHash },
                { contactNo: Number(contactNoHash) }
            ]
        });
        if (!user) {
            return sendErrorResponse(res, 404, "User not found.");
        }

        if (!user.otp) {
            return sendBadRequestResponse(res, "No OTP found. Please request a new OTP.");
        }

        if (user.otp !== otp) {
            return sendBadRequestResponse(res, "Invalid OTP.");
        }

        user.lastLogin = new Date();
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        const token = await user.getJWT();
        if (!token) {
            return sendErrorResponse(res, 500, "Failed to generate token");
        }
        return sendSuccessResponse(res, "OTP verified successfully.", { token: token });



    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email, contactNo } = req.body;

        const contactNoHash = contactNo ? encryptData(contactNo) : undefined;
        const emailHash = email ? encryptData(email) : undefined;

        // 1. Forgot by Contact Number
        if (contactNo && !email) {
            const otp = generateOTP()

            const user = await User.findOne({ contactNo: contactNoHash });
            if (!user) {
                return sendErrorResponse(res, 404, "User not found");
            }

            // Send OTP to contactNo (use original, not encrypted)
            const smsSent = await phoneNoOtp(contactNo, otp);
            if (!smsSent) {
                return sendErrorResponse(res, 500, "Failed to send OTP via SMS");
            }
            user.otp = otp;
            user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
            await user.save();

            return sendSuccessResponse(res, "OTP sent to contact number", { contactNo });
        }

        // 2. Forgot by Email
        if (email && !contactNo) {
            const otp = generateOTP()
            // Find user by email
            const user = await User.findOne({ email: emailHash });
            if (!user) {
                return sendErrorResponse(res, 404, "User not found");
            }

            // Send OTP to the original email (not encrypted)
            await sendOtpEmail(email, otp);
            // Set OTP and expiry (e.g., 5 minutes from now)
            user.otp = otp;
            user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
            await user.save();
            // Send OTP to email

            return sendSuccessResponse(res, "OTP sent to email", { email });
        }

        // If neither provided
        return sendBadRequestResponse(res, "Please provide either email or contact number");

    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

//Verify Otp
export const VerifyOtp = async (req, res) => {
    try {
        const { contactNo, email, otp } = req.body;

        if (contactNo && otp) {
            const contactNoHash = contactNo ? encryptData(contactNo) : undefined;
            const user = await User.findOne({ contactNo: contactNoHash });
            if (!user) {
                return sendErrorResponse(res, 404, "User not found.");
            }
            if (!user.otp || !user.otpExpiry) {
                return sendBadRequestResponse(res, "No OTP found. Please request a new OTP.");
            }
            if (user.otp !== otp) {
                return sendBadRequestResponse(res, "Invalid OTP.");
            }
            if (user.otpExpiry < Date.now()) {
                return sendBadRequestResponse(res, "OTP has expired. Please request a new OTP.");
            }
            user.lastLogin = new Date();
            user.otp = undefined;
            user.otpExpiry = undefined;
            await user.save();
            return sendSuccessResponse(res, "OTP verified successfully.");
        } else if (email && otp) {
            const emailHash = email ? encryptData(email) : undefined;
            const user = await User.findOne({ email: emailHash });
            if (!user) {
                return sendErrorResponse(res, 404, "User not found.");
            }
            if (!user.otp || !user.otpExpiry) {
                return sendBadRequestResponse(res, "No OTP found. Please request a new OTP.");
            }
            if (user.otp !== otp) {
                return sendBadRequestResponse(res, "Invalid OTP.");
            }
            if (user.otpExpiry < Date.now()) {
                return sendBadRequestResponse(res, "OTP has expired. Please request a new OTP.");
            }
            user.lastLogin = new Date();
            user.otp = undefined;
            user.otpExpiry = undefined;
            await user.save();
            return sendSuccessResponse(res, "OTP verified successfully.");
        } else {
            return sendBadRequestResponse(res, "Please provide contactNo or email and OTP.");
        }
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Reset Password using OTP
export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword,  } = req.body;
        if (!newPassword) {
            return sendBadRequestResponse(res, "Please provide email and password.");
        }

        const emailHash = email ? encryptData(email) : undefined;
        const newPasswordHash = newPassword ? encryptData(newPassword) : undefined;

        const user = await User.findOne({ email: emailHash });
        if (!user) {
            return sendErrorResponse(res, 400, "User Not Found");
        }

        user.password = newPasswordHash;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        // Return the original email (not encrypted) in response
        return sendSuccessResponse(res, "Password reset successfully.", { id: user._id, email: email });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Change Password for user
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const currentPasswordHash = currentPassword ? encryptData(currentPassword) : undefined;

        const newPasswordHash = newPassword ? encryptData(newPassword) : undefined; 
        if (!currentPassword || !newPassword || !confirmPassword) {
            return sendBadRequestResponse(res, "currentPassword, newPassword, and confirmPassword are required.");
        }

        if (!req.user) {
            return sendUnauthorizedResponse(res, "You must be logged in to change your password.");
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return sendErrorResponse(res, 404, "User not found.");
        }

        const isMatch = await user.validatePassword(currentPassword);
        if (!isMatch) {
            return sendBadRequestResponse(res, "Current password is incorrect.");
        }

        if (newPassword === currentPassword) {
            return sendBadRequestResponse(res, "New password cannot be the same as current password.");
        }

        if (newPassword !== confirmPassword) {
            return sendBadRequestResponse(res, "New password and confirm password do not match.");
        }

        user.password = newPasswordHash;
        await user.save();

        return sendSuccessResponse(res, "Password changed successfully.");
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const generateNewToken = async (req, res) => {
    let  token =  req?.cookies?.refreshToken || req.header("Authorization").split(" ")[1];

    console.log(req?.cookies,req.header("Authorization"));
    
  
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not available",
      });
    }
  
    jwt.verify(
      token,
      process.env.REFRESH_SECRET_KEY,
      async function (err, decoded) {
        try {
          console.log(err);
  
          if (err) {
            return res.status(400).json({
              success: false,
              message: "Token invalid",
            });
          }
  
          const USERS = await User.findOne({ _id: decoded._id });
          // console.log("USERSss", USERS);
  
          if (!USERS) {
            return res.status(404).json({
              success: false,
              message: "User not found..!!",
            });
          }
          const { accessToken, refreshToken } = await generateTokens(decoded._id);
  
          const userDetails = await User
            .findOne({ _id: USERS._id })
            .select("-password -refreshToken");
          // console.log("userDetailsss", userDetails);
  
          return res
            .status(200)
            .cookie("accessToken", accessToken, {
              httpOnly: true,
              secure: true,
              maxAge: 2 *60 * 60 * 1000,
              sameSite: "Strict",
            })
            .cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: true,
              maxAge: 15 * 24 * 60 * 60 * 1000,
              sameSite: "Strict",
            })
            .json({
              success: true,
              finduser: userDetails,
              accessToken: accessToken,
              refreshToken: refreshToken,
            });
        } catch (error) {
          return res.status(500).json({
            success: false,
            data: [],
            error: "Error in register user: " + error.message,
          });
        }
      }
    );
  };
  

//logoutUser
// export const logoutUser = async (req, res) => {
//     try {
//         res.cookie("token", null, {
//             expires: new Date(Date.now()),
//             httpOnly: true,
//             path: "/"
//         });
//         return sendSuccessResponse(res, "User logout successfully...✅");
//     } catch (error) {
//         return sendErrorResponse(res, 400, error.message);
//     }
// };

export const logoutUser = async (req,res)=>{
    try {
        const userId = req.user._id;
        const user  = User.findById(userId);
        return res.status(200)
            .clearCookie("accessToken")
            .clearCookie("refreshToken")
            .json({
                success: true,
                message: "User logged Out",
              });
    } catch (error) {
        
    }
}
