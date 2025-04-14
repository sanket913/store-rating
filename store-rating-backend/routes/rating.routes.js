
const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:storeId', authMiddleware, ratingController.submitOrUpdateRating);
router.get('/my', authMiddleware, ratingController.getUserRatings);
router.get('/store/:storeId', authMiddleware, ratingController.getStoreRatings);

module.exports = router;
