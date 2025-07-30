const express = require ('express');
const router = express.Router();

const AdminWhiteListMiddleware = require('../middleware/AdminWhiteList');
const {loginAdmin} = require('../Controllers/adminController');

// Apply the whitelist before the Login controller

router.post('/login', AdminWhiteListMiddleware,loginAdmin);

module.exports=router;