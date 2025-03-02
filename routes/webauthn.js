const express = require('express');
const webauthnController = require('../controllers/webauthnController');
const router = express.Router();

// Registration routes
router.post('/register/request', webauthnController.requestRegistrationOptions);
router.post('/register/verify', webauthnController.verifyRegistration);

// Login routes
router.post('/login/request', webauthnController.requestLoginOptions);
router.post('/login/verify', webauthnController.verifyLogin);

module.exports = router;