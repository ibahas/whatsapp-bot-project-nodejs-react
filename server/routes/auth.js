const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const whatsapp = require('../services/whatsapp');
const User = require('../models/user');
const Session = require('../models/session');
const Token = require('../models/token');

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many attempts, please try again later'
});

// Helper function to generate a random code
const generateRandomCode = (length) => {
  return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1))).toString();
}

// QR Code Login Endpoint
router.post('/qr-init', authLimiter, async (req, res) => {
  try {
    const { userId } = req.body;

    // Generate a new client ID
    const clientId = `wa-${userId}-${Date.now()}`;

    // Initialize WhatsApp client
    await whatsapp.initClient(clientId, userId);

    // Create session record
    const session = await Session.create({
      userId,
      clientId,
      status: 'qr_pending'
    });

    res.status(200).json({
      success: true,
      sessionId: session._id,
      clientId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to initialize QR login'
    });
  }
});

// Check QR Login Status
router.get('/qr-status/:sessionId', authLimiter, async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    const status = await whatsapp.getClientStatus(session.clientId);
    let user = null;

    // If connected, get user data
    if (status === 'connected') {
      user = await User.findById(session.userId).select('-password');
      await Session.updateOne(
        { _id: session._id },
        { status: 'active' }
      );
    }

    res.status(200).json({
      success: true,
      status,
      user: status === 'connected' ? user : null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to check QR status'
    });
  }
});

// Phone OTP Login
router.post('/send-otp',
  authLimiter,
  body('phone').isMobilePhone().withMessage('Invalid phone number'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { phone } = req.body;
      const otp = generateRandomCode(6);
      const otpExpiry = Date.now() + 300000; // 5 minutes

      // Find or create user
      let user = await User.findOne({ phone });
      if (!user) {
        user = await User.create({
          phone,
          otp,
          otpExpiry
        });
      } else {
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();
      }

      // Send OTP via WhatsApp (using Twilio or direct WhatsApp)
      await sendOTP(phone, otp);

      res.status(200).json({
        success: true,
        message: 'OTP sent successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to send OTP'
      });
    }
  }
);

// Verify OTP
router.post('/verify-otp',
  authLimiter,
  body('phone').isMobilePhone().withMessage('Invalid phone number'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { phone, otp } = req.body;
      const user = await User.findOne({ phone });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Check OTP expiry
      if (user.otpExpiry < Date.now()) {
        return res.status(400).json({
          success: false,
          error: 'OTP expired'
        });
      }

      // Verify OTP
      if (user.otp !== otp) {
        return res.status(400).json({
          success: false,
          error: 'Invalid OTP'
        });
      }

      // Generate tokens
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );

      // Save refresh token
      await Token.create({
        user: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      // Clear OTP
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();

      res.status(200).json({
        success: true,
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          phone: user.phone,
          name: user.name
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to verify OTP'
      });
    }
  }
);

// Refresh Token
router.post('/refresh-token', authLimiter, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token required'
      });
    }

    // Verify token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const tokenDoc = await Token.findOne({
      token: refreshToken,
      user: decoded.id,
      blacklisted: false
    });

    if (!tokenDoc) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.status(200).json({
      success: true,
      accessToken: newAccessToken
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to refresh token'
    });
  }
});

// Logout
router.post('/logout', authLimiter, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token required'
      });
    }

    // Blacklist token
    await Token.findOneAndUpdate(
      { token: refreshToken },
      { blacklisted: true }
    );

    // Destroy WhatsApp session if exists
    const decoded = jwt.decode(refreshToken);
    if (decoded?.id) {
      const sessions = await Session.find({
        userId: decoded.id,
        status: 'active'
      });

      for (const session of sessions) {
        await whatsapp.cleanupClient(session.clientId);
      }

      await Session.updateMany(
        { userId: decoded.id },
        { status: 'logged_out' }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to logout'
    });
  }
});

// Check Phone Availability
router.get('/check-phone/:phone', authLimiter, async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone });
    res.status(200).json({
      success: true,
      exists: !!user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to check phone'
    });
  }
});

module.exports = router;
