// controllers/admin.controller.js
const db = require('../db');

exports.getDashboardStats = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const [[{ total_users }]] = await db.promise().query(`SELECT COUNT(*) AS total_users FROM users`);
    const [[{ total_stores }]] = await db.promise().query(`SELECT COUNT(*) AS total_stores FROM stores`);
    const [[{ total_ratings }]] = await db.promise().query(`SELECT COUNT(*) AS total_ratings FROM ratings`);

    res.json({ total_users, total_stores, total_ratings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { search } = req.query;

  try {
    let query = `SELECT id, name, email, address, role FROM users`;
    const params = [];

    if (search) {
      query += ` WHERE name LIKE ? OR email LIKE ? OR address LIKE ? OR role LIKE ?`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY name ASC`;

    const [users] = await db.promise().query(query, params);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllStores = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { search } = req.query;

  try {
    let query = `
      SELECT s.id, s.name, s.email, s.address,
             u.name AS owner_name,
             IFNULL(ROUND(AVG(r.rating_value), 1), 0) AS average_rating
      FROM stores s
      LEFT JOIN users u ON s.owner_id = u.id
      LEFT JOIN ratings r ON s.id = r.store_id
    `;
    const params = [];

    if (search) {
      query += ` WHERE s.name LIKE ? OR s.email LIKE ? OR s.address LIKE ?`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` GROUP BY s.id ORDER BY s.name ASC`;

    const [stores] = await db.promise().query(query, params);
    res.json(stores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
// Update user
exports.updateUser = async (req, res) => {
  const { name, email, address, role } = req.body;
  const { id } = req.params;

  try {
    await db.promise().query(
      'UPDATE users SET name = ?, email = ?, address = ?, role = ? WHERE id = ?',
      [name, email, address, role, id]
    );
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await db.promise().query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
