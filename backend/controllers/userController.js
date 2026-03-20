// const User = require('../models/User');
// const jwt = require('jsonwebtoken');

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: '30d'
//   });
// };

// exports.registerUser = async (req, res) => {
//   try {
//     const { email, password, username } = req.body;

//     // Check if user exists
//     const userExists = await User.findOne({ $or: [{ email }, { username }] });
//     if (userExists) {
//       return res.status(400).json({
//         success: false,
//         message: 'User already exists'
//       });
//     }

//     // Create user
//     const user = await User.create({
//       email,
//       password,
//       username
//     });

//     res.status(201).json({
//       success: true,
//       data: {
//         id: user._id,
//         email: user.email,
//         username: user.username,
//         token: generateToken(user._id)
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Registration failed',
//       error: error.message
//     });
//   }
// };

// exports.loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     user.lastLogin = new Date();
//     await user.save();

//     res.status(200).json({
//       success: true,
//       data: {
//         id: user._id,
//         email: user.email,
//         username: user.username,
//         token: generateToken(user._id),
//         preferences: user.preferences
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Login failed'
//     });
//   }
// };

// exports.getUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id)
//       .select('-password')
//       .populate('wallets');

//     res.status(200).json({
//       success: true,
//       data: user
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch profile'
//     });
//   }
// };

// exports.updateUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
    
//     if (req.body.username) user.username = req.body.username;
//     if (req.body.email) user.email = req.body.email;
//     if (req.body.preferences) user.preferences = { ...user.preferences, ...req.body.preferences };
    
//     await user.save();

//     res.status(200).json({
//       success: true,
//       data: {
//         id: user._id,
//         email: user.email,
//         username: user.username,
//         preferences: user.preferences
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update profile'
//     });
//   }
// };