import React, { useEffect, useState } from 'react';
import API from '../api';
import { logout, getUser } from '../auth';
import './UserDashboard.css';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [userRatings, setUserRatings] = useState({});
  const [selectedRatings, setSelectedRatings] = useState({});

  const user = getUser();

  const fetchStores = async () => {
    try {
      const res = await API.get(`/stores${search ? `?search=${search}` : ''}`);
      setStores(res.data);
    } catch (err) {
      alert('Error fetching stores');
    }
  };

  const fetchUserRatings = async () => {
    try {
      const res = await API.get('/ratings/my');
      const ratings = {};
      res.data.forEach((r) => {
        ratings[r.store_id] = r.rating_value;
      });
      setUserRatings(ratings);
      setSelectedRatings(ratings);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRatingChange = (storeId, rating) => {
    setSelectedRatings((prev) => ({
      ...prev,
      [storeId]: rating,
    }));
  };

  const handleRatingSubmit = async (storeId) => {
    try {
      const rating = selectedRatings[storeId];
      if (!rating) {
        return alert('Please select a rating before submitting');
      }
      await API.post(`/ratings/${storeId}`, { rating_value: rating });
      alert('Rating submitted!');

      fetchStores();
      fetchUserRatings();

      setSelectedRatings((prev) => ({
        ...prev,
        [storeId]: '',
      }));
    } catch (err) {
      alert('Error submitting rating');
    }
  };

  useEffect(() => {
    fetchStores();
    fetchUserRatings();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="container">
        <h2 className="dashboard-title">Welcome, {user?.name}</h2>

        <div className="dashboard-controls">
          <input
            className="form-control"
            placeholder="Search stores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-outline-primary" onClick={fetchStores}>
            🔍 Search
          </button>
          <button className="btn btn-outline-danger ms-auto" onClick={logout}>
            🚪 Logout
          </button>
        </div>

        <div className="row">
          {stores.map((store) => (
            <div className="col-md-4 mb-4" key={store.id}>
              <div className="card-store h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title">{store.name}</h5>
                    <p className="text-muted">{store.address}</p>
                    <p>
                      <strong>⭐ Average Rating:</strong>{' '}
                      <span className="text-warning">{store.average_rating}</span>
                    </p>
                  </div>
                  <div className="mt-3">
                    <label className="form-label fw-semibold">Your Rating:</label>
                    <select
                      className="form-select"
                      value={selectedRatings[store.id] || ''}
                      onChange={(e) =>
                        handleRatingChange(store.id, e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      {[1, 2, 3, 4, 5].map((val) => (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                    <button
                      className="btn btn-success w-100"
                      onClick={() => handleRatingSubmit(store.id)}
                    >
                      ✅ Submit Rating
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {stores.length === 0 && (
            <div className="empty-message">
              <p>No stores found. Try a different search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
