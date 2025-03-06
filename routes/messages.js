const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');

// POST request to handle incoming messages from your contact form
router.post('/send', messagesController.sendMessage);

module.exports = router;