import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import passport from 'passport'
import jwt from 'jsonwebtoken'

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res, next) => {
    passport.authenticate("local", { session: false }, (error, user) => {
        
        if (error || !user) {
          throw new Error('Email or password not correct')
        } else {
          const payload = {
            sub: user._id,
            exp: Date.now() + parseInt(process.env.JWT_LIFETIME),
            email: user.email,
          };
  
          const token = jwt.sign(
            JSON.stringify(payload),
            process.env.JWT_SECRET,
            { algorithm: process.env.JWT_ALGORITHM }
          );
          res.json({ token: token });
        }
      })(req, res);
})

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res, next) => {

    User.findOne({ email: req.body.email })
    .then((data) => {
      if (data) {
        throw new Error('User already exists')
      } else {
        
        let hash = bcrypt.hashSync(
          req.body.password,
          parseInt(process.env.BCRYPT_ROUNDS)
        );
        
        let document = new User({
          username: req.body.username,
          firstName: req.body.firstName || "",
          lastName: req.body.lastName || "",
          email: req.body.email || "",
          password: hash
        });
        return document.save();
      }
    })
    .then((data) => {
      res.json({ data: data });
    })
    .catch((err) => {
      console.log('Req body ', err)
      next(err);
    });
})

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')

    if (user) {
      res.json(user)
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  } catch (err) {
    console.log('Error is ', err)
  }
})

export {
  authUser,
  registerUser,
  getUserProfile,
}

