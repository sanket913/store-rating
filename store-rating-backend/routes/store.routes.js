
const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, storeController.addStore);          // Admin adds store
router.get('/', authMiddleware, storeController.getAllStores);       // All users can view
router.get('/:id', authMiddleware, storeController.getStoreById);    // View one store
router.get('/my', authMiddleware, storeController.getMyStore);  // 👈 new route


module.exports = router;
