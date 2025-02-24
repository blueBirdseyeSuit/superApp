const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.getAdminPanel);
router.get('/users', adminController.getAllUsers);
router.post('/user', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.get('/search', adminController.searchUsers);

module.exports = router;