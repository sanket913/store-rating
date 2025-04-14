
const db = require('../db');

exports.submitOrUpdateRating = async (req, res) => {
  const { rating_value } = req.body;
  const storeId = req.params.storeId;
  const userId = req.user.id;

  if (!rating_value || rating_value < 1 || rating_value > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const [existing] = await db.promise().query(
      'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, storeId]
    );

    if (existing.length > 0) {
      await db.promise().query(
        'UPDATE ratings SET rating_value = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND store_id = ?',
        [rating_value, userId, storeId]
      );
      res.json({ message: 'Rating updated successfully' });
    } else {
      await db.promise().query(
        'INSERT INTO ratings (store_id, user_id, rating_value) VALUES (?, ?, ?)',
        [storeId, userId, rating_value]
      );
      res.json({ message: 'Rating submitted successfully' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserRatings = async (req, res) => {
  const userId = req.user.id;

  try {
    const [ratings] = await db.promise().query(
      `SELECT r.store_id, s.name AS store_name, s.address, r.rating_value, r.updated_at
       FROM ratings r
       JOIN stores s ON s.id = r.store_id
       WHERE r.user_id = ?`,
      [userId]
    );

    res.json(ratings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStoreRatings = async (req, res) => {
  const storeId = req.params.storeId;
  const userId = req.user.id;

  try {
    const [[store]] = await db.promise().query('SELECT * FROM stores WHERE id = ?', [storeId]);

    if (!store) return res.status(404).json({ message: 'Store not found' });

    if (req.user.role === 'owner' && store.owner_id !== userId) {
      return res.status(403).json({ message: 'You do not own this store' });
    }

    const [ratings] = await db.promise().query(
      `SELECT u.name, u.email, r.rating_value, r.updated_at
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = ?`,
      [storeId]
    );

    res.json({
      store: store.name,
      total_ratings: ratings.length,
      ratings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
