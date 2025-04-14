const db = require('../db');

exports.addStore = async (req, res) => {
  const { name, email, address, owner_id } = req.body;

  if (!name || !address) {
    return res.status(400).json({ message: 'Store name and address are required' });
  }

  const userRole = req.user.role;
  const userId = req.user.id;
  const finalOwnerId = userRole === 'admin' ? (owner_id || null) : userId;

  if (userRole !== 'admin' && userRole !== 'owner') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    await db.promise().query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email || null, address, finalOwnerId]
    );
    res.status(201).json({ message: 'Store added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllStores = async (req, res) => {
  const { search } = req.query;

  try {
    let query = `
      SELECT s.id, s.name, s.address,
             IFNULL(ROUND(AVG(r.rating_value), 1), 0) AS average_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
    `;
    const params = [];

    if (search) {
      query += ' WHERE s.name LIKE ? OR s.address LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' GROUP BY s.id ORDER BY s.name ASC';

    const [stores] = await db.promise().query(query, params);
    res.json(stores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStoreById = async (req, res) => {
  const storeId = req.params.id;

  try {
    const [[store]] = await db.promise().query(
      `SELECT s.id, s.name, s.email, s.address,
              IFNULL(ROUND(AVG(r.rating_value), 1), 0) AS average_rating
       FROM stores s
       LEFT JOIN ratings r ON s.id = r.store_id
       WHERE s.id = ?`,
      [storeId]
    );

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.json(store);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getMyStore = async (req, res) => {
  try {
    console.log("Logged-in User ID:", req.user.id);

    const [rows] = await db.promise().query(
      `SELECT s.id, s.name, s.email, s.address,
              IFNULL(ROUND(AVG(r.rating_value), 1), 0) AS average_rating
       FROM stores s
       LEFT JOIN ratings r ON s.id = r.store_id
       WHERE s.owner_id = ?
       GROUP BY s.id`,
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.json(null);
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching store:", err);
  }
};



