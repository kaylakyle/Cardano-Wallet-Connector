const User = require('../models/User');

class WalletController {
  // Connect/Register wallet
  async connectWallet(req, res) {
    try {
      const { walletAddress, stakeAddress, username, email } = req.body;
      
      if (!walletAddress) {
        return res.status(400).json({ message: 'Wallet address is required' });
      }

      let user = await User.findOne({ walletAddress });
      
      if (!user) {
        // Create new user
        user = new User({
          walletAddress,
          stakeAddress,
          username,
          email,
          lastLogin: new Date()
        });
        await user.save();
        
        return res.status(201).json({
          message: 'Wallet connected and registered successfully',
          user,
          isNewUser: true
        });
      }
      
      // Update last login for existing user
      user.lastLogin = new Date();
      if (stakeAddress) user.stakeAddress = stakeAddress;
      if (username) user.username = username;
      if (email) user.email = email;
      await user.save();
      
      res.json({
        message: 'Wallet connected successfully',
        user,
        isNewUser: false
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      res.status(500).json({ message: 'Error connecting wallet', error: error.message });
    }
  }

  // Get user by wallet address
  async getUserByWallet(req, res) {
    try {
      const { walletAddress } = req.params;
      const user = await User.findOne({ walletAddress });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
  }

  // Update user profile
  async updateProfile(req, res) {
    try {
      const { walletAddress } = req.params;
      const updates = req.body;
      
      const user = await User.findOneAndUpdate(
        { walletAddress },
        { $set: updates },
        { new: true, runValidators: true }
      );
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
  }

  // Get all users (admin)
  async getAllUsers(req, res) {
    try {
      const users = await User.find().sort({ createdAt: -1 }).limit(100);
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  }
}

module.exports = new WalletController();