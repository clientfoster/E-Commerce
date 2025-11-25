import express from 'express';
import User from '../../src/models/User.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({
      email,
      password, // Will be hashed by pre-save middleware
      fullName,
      isAdmin: false,
    });

    // Generate JWT token
    const { generateToken } = await import('../middleware/auth.js');
    const token = generateToken(user._id.toString());

    res.json({
      user: { id: user._id, email: user.email },
      token: token,
      profile: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName || null,
        avatarUrl: user.avatarUrl || null,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sign In
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password using bcrypt
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const { generateToken } = await import('../middleware/auth.js');
    const token = generateToken(user._id.toString());

    res.json({
      user: { id: user._id, email: user.email },
      token: token,
      profile: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName || null,
        avatarUrl: user.avatarUrl || null,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName || null,
      avatarUrl: user.avatarUrl || null,
      isAdmin: user.isAdmin,
      addresses: user.addresses || [],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Address
router.post('/addresses', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newAddress = req.body;

    // If set as default, unset other defaults
    if (newAddress.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push(newAddress);
    await user.save();

    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Address
router.put('/addresses/:addressId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === req.params.addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ error: 'Address not found' });
    }

    const updatedAddress = req.body;

    // If set as default, unset other defaults
    if (updatedAddress.isDefault) {
      user.addresses.forEach((addr, index) => {
        if (index !== addressIndex) addr.isDefault = false;
      });
    }

    user.addresses[addressIndex] = { ...user.addresses[addressIndex].toObject(), ...updatedAddress };
    await user.save();

    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Address
router.delete('/addresses/:addressId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.addressId);
    await user.save();

    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
