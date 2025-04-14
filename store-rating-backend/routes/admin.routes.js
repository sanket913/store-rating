
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/dashboard', authMiddleware, adminController.getDashboardStats);
router.get('/users', authMiddleware, adminController.getAllUsers);
router.get('/stores', authMiddleware, adminController.getAllStores);
router.put('/users/:id', authMiddleware, adminController.updateUser);
router.delete('/users/:id', authMiddleware, adminController.deleteUser);
router.delete('/stores/:id', authMiddleware, adminController.deleteStore);
router.put('/stores/:id', authMiddleware, adminController.updateStore);


module.exports = router;
