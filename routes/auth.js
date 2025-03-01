const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

// Email registration
router.post(
    '/register/email',
    [
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('name').not().isEmpty().withMessage('Name is required')
    ],
    authController.registerEmail
);

// Phone registration
router.post(
    '/register/phone',
    [
        body('phoneNumber').isMobilePhone().withMessage('Please enter a valid phone number'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('name').not().isEmpty().withMessage('Name is required')
    ],
    authController.registerPhone
);

// Email verification
router.get('/verify-email', authController.verifyEmail);

// Phone verification
router.post('/verify-phone', authController.verifyPhone);

// Email login
router.post(
    '/login/email',
    [
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('password').not().isEmpty().withMessage('Password is required')
    ],
    authController.loginEmail
);

// Phone login
router.post(
    '/login/phone',
    [
        body('phoneNumber').isMobilePhone().withMessage('Please enter a valid phone number')
    ],
    authController.loginPhone
);

// Forgot password
router.post(
    '/forgot-password',
    [
        body('email').isEmail().withMessage('Please enter a valid email')
    ],
    authController.forgotPassword
);

// Reset password
router.post(
    '/reset-password',
    [
        body('token').not().isEmpty().withMessage('Token is required'),
        body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ],
    authController.resetPassword
);

module.exports = router;