const express = require('express');
const appControllers = require('../controllers/app_controller.js');
const router = express.Router();
router.get('/', appControllers.homeRoute);
router.get('/about', appControllers.aboutRoute);
router.get('/contact', appControllers.contactRoute);
router.get('/cart', appControllers.shoppingCartRoute);
router.get('/signup', appControllers.signupRoute);
router.get('/login', appControllers.loginRoute);
router.post('/signup', appControllers.saveNewUser);
router.post('/login', appControllers.saveUserLogin);
router.post('/contact', appControllers.saveUserComment);
router.get('/logout', appControllers.logoutRoute);

module.exports = router;