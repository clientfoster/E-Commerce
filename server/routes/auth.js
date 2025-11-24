import express from 'express';
import User from '../../src/models/User.ts';

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
      password,
      fullName,
      isAdmin: false,
    });

    res.json({
      user: { id: user._id, email: user.email },
      token: user._id.toString(),
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
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      user: { id: user._id, email: user.email },
      token: user._id.toString(),
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
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName || null,
      avatarUrl: user.avatarUrl || null,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
