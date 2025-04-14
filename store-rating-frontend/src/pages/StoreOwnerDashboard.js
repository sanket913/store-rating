import React, { useEffect, useState } from 'react';
import API from '../api';
import { logout, getUser } from '../auth';

const StoreOwnerDashboard = () => {
  const [userStore, setUserStore] = useState(null);
  const [allStores, setAllStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', address: '' });
  const user = getUser();

  const fetchUserStore = async () => {
    try {
      const res = await API.get('/stores/my');
      if (res.data && res.data.id !== null) {
        setUserStore(res.data);
      }
    } catch (err) {
      console.error('Error fetching user store');
    }
  };

  const fetchAllStores = async () => {
    try {
      const res = await API.get('/stores');
      setAllStores(res.data);
    } catch (err) {
      console.error('Error fetching all stores');
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    try {
      await API.post('/stores', form);
      alert('Store created successfully!');
      setForm({ name: '', address: '' });
      fetchUserStore();
      fetchAllStores();
    } catch (err) {
      alert('Failed to create store');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchUserStore();
      await fetchAllStores();
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Welcome, {user?.name}</h2>
        <div className="text-end">
          <button className="btn btn-danger" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {!userStore ? (
        <form onSubmit={handleCreateStore} className="mt-4 p-4 border rounded shadow-lg bg-light">
          <h4 className="mb-3">Add Your Store</h4>
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Store Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Store Address"
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <button className="btn btn-primary w-100" type="submit">
            Create Store
          </button>
        </form>
      ) : (
        <div className="card p-4 my-4 shadow-lg">
          <h4 className="text-success">Your Store</h4>
          <h5 className="text-primary">{userStore.name}</h5>
          <p>{userStore.address}</p>
          <p><strong>Average Rating:</strong> {userStore.average_rating || 'N/A'}</p>
        </div>
      )}

      <h4 className="mt-5 mb-3">All Stores</h4>
      {allStores.length === 0 ? (
        <p>No stores found.</p>
      ) : (
        <div className="row">
          {allStores.map((store) => (
            <div className="col-md-4 mb-4" key={store.id}>
              <div className="card p-3 shadow-sm h-100">
                <h5 className="text-primary">{store.name}</h5>
                <p>{store.address}</p>
                <p><strong>Average Rating:</strong> {store.average_rating || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreOwnerDashboard;
