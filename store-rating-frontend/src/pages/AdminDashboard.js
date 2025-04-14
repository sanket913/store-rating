
import React, { useEffect, useState } from 'react';
import API from '../api';
import { logout, getUser } from '../auth';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total_users: 0, total_stores: 0, total_ratings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userSearch, setUserSearch] = useState('');
  const [storeSearch, setStoreSearch] = useState('');
  const [userSort, setUserSort] = useState({ column: '', direction: 'asc' });
  const [storeSort, setStoreSort] = useState({ column: '', direction: 'asc' });

  const [editingUser, setEditingUser] = useState(null);
  const [editUserForm, setEditUserForm] = useState({ name: '', email: '', address: '', role: '' });

  const [editingStore, setEditingStore] = useState(null);
  const [editStoreForm, setEditStoreForm] = useState({ name: '', address: '', owner_name: '' });

  const fetchStats = async () => {
    const res = await API.get('/admin/dashboard');
    setStats(res.data);
  };

  const fetchUsers = async () => {
    const res = await API.get(`/admin/users?search=${userSearch}`);
    setUsers(res.data);
  };

  const fetchStores = async () => {
    const res = await API.get(`/admin/stores?search=${storeSearch}`);
    setStores(res.data);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'stores') fetchStores();
  }, [activeTab, userSearch, storeSearch]);

  const handleUserSort = (column) => {
    setUserSort((prev) => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleStoreSort = (column) => {
    setStoreSort((prev) => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedUsers = [...users].sort((a, b) => {
    const col = userSort.column;
    if (!col) return 0;
    const valA = a[col]?.toString().toLowerCase();
    const valB = b[col]?.toString().toLowerCase();
    if (valA < valB) return userSort.direction === 'asc' ? -1 : 1;
    if (valA > valB) return userSort.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const sortedStores = [...stores].sort((a, b) => {
    const col = storeSort.column;
    if (!col) return 0;
    const valA = a[col]?.toString().toLowerCase();
    const valB = b[col]?.toString().toLowerCase();
    if (valA < valB) return storeSort.direction === 'asc' ? -1 : 1;
    if (valA > valB) return storeSort.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const renderSortArrow = (col, currentSort) => {
    if (currentSort.column !== col) return '';
    return currentSort.direction === 'asc' ? ' ▲' : ' ▼';
  };

  const openEditUserModal = (user) => {
    setEditingUser(user);
    setEditUserForm({ name: user.name, email: user.email, address: user.address, role: user.role });
  };

  const closeEditUserModal = () => {
    setEditingUser(null);
  };

  const handleEditUserChange = (e) => {
    setEditUserForm({ ...editUserForm, [e.target.name]: e.target.value });
  };

  const saveUserChanges = async () => {
    try {
      await API.put(`/admin/users/${editingUser.id}`, editUserForm);
      alert('User updated successfully');
      fetchUsers();
      closeEditUserModal();
    } catch (err) {
      alert('Failed to update user');
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await API.delete(`/admin/users/${id}`);
        alert('User deleted');
        fetchUsers();
      } catch (err) {
        alert('Error deleting user');
      }
    }
  };

  const openEditStoreModal = (store) => {
    setEditingStore(store);
    setEditStoreForm({
      name: store.name,
      address: store.address,
      owner_name: store.owner_name,
    });
  };

  const closeEditStoreModal = () => {
    setEditingStore(null);
  };

  const handleEditStoreChange = (e) => {
    setEditStoreForm({ ...editStoreForm, [e.target.name]: e.target.value });
  };

  const saveStoreChanges = async () => {
    try {
      await API.put(`/admin/stores/${editingStore.id}`, editStoreForm);
      alert('Store updated successfully');
      fetchStores();
      closeEditStoreModal();
    } catch (err) {
      alert('Failed to update store');
    }
  };

  const deleteStore = async (id) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      try {
        await API.delete(`/admin/stores/${id}`);
        alert('Store deleted');
        fetchStores();
      } catch (err) {
        alert('Error deleting store');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Welcome Admin, {getUser()?.name}</h2>

      <div className="btn-group mb-3">
        <button className={`btn btn-outline-primary ${activeTab === 'dashboard' && 'active'}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button className={`btn btn-outline-primary ${activeTab === 'users' && 'active'}`} onClick={() => setActiveTab('users')}>Users</button>
        <button className={`btn btn-outline-primary ${activeTab === 'stores' && 'active'}`} onClick={() => setActiveTab('stores')}>Stores</button>
        <button className="btn btn-danger ms-auto" onClick={logout}>Logout</button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="row text-center">
          <div className="col-md-4"><div className="card p-3 shadow"><h5>Total Users</h5><h2>{stats.total_users}</h2></div></div>
          <div className="col-md-4"><div className="card p-3 shadow"><h5>Total Stores</h5><h2>{stats.total_stores}</h2></div></div>
          <div className="col-md-4"><div className="card p-3 shadow"><h5>Total Ratings</h5><h2>{stats.total_ratings}</h2></div></div>
        </div>
      )}

      {activeTab === 'users' && (
        <>
          <input className="form-control mb-3" placeholder="Search users..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th onClick={() => handleUserSort('name')} style={{ cursor: 'pointer' }}>Name {renderSortArrow('name', userSort)}</th>
                <th onClick={() => handleUserSort('email')} style={{ cursor: 'pointer' }}>Email {renderSortArrow('email', userSort)}</th>
                <th onClick={() => handleUserSort('address')} style={{ cursor: 'pointer' }}>Address {renderSortArrow('address', userSort)}</th>
                <th onClick={() => handleUserSort('role')} style={{ cursor: 'pointer' }}>Role {renderSortArrow('role', userSort)}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user, i) => (
                <tr key={i}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.address}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => openEditUserModal(user)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteUser(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {activeTab === 'stores' && (
        <>
          <input className="form-control mb-3" placeholder="Search stores..." value={storeSearch} onChange={(e) => setStoreSearch(e.target.value)} />
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th onClick={() => handleStoreSort('name')} style={{ cursor: 'pointer' }}>Name {renderSortArrow('name', storeSort)}</th>
                <th onClick={() => handleStoreSort('address')} style={{ cursor: 'pointer' }}>Address {renderSortArrow('address', storeSort)}</th>
                <th onClick={() => handleStoreSort('owner_name')} style={{ cursor: 'pointer' }}>Owner {renderSortArrow('owner_name', storeSort)}</th>
                <th onClick={() => handleStoreSort('average_rating')} style={{ cursor: 'pointer' }}>Avg Rating {renderSortArrow('average_rating', storeSort)}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedStores.map((store, i) => (
                <tr key={i}>
                  <td>{store.name}</td>
                  <td>{store.address}</td>
                  <td>{store.owner_name || 'N/A'}</td>
                  <td>{store.average_rating}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => openEditStoreModal(store)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteStore(store.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {editingUser && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button type="button" className="btn-close" onClick={closeEditUserModal}></button>
              </div>
              <div className="modal-body">
                <input className="form-control mb-2" name="name" value={editUserForm.name} onChange={handleEditUserChange} placeholder="Name" />
                <input className="form-control mb-2" name="email" value={editUserForm.email} onChange={handleEditUserChange} placeholder="Email" />
                <input className="form-control mb-2" name="address" value={editUserForm.address} onChange={handleEditUserChange} placeholder="Address" />
                <select className="form-control mb-2" name="role" value={editUserForm.role} onChange={handleEditUserChange}>
                  <option value="user">User</option>
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeEditUserModal}>Cancel</button>
                <button className="btn btn-success" onClick={saveUserChanges}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingStore && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Store</h5>
                <button type="button" className="btn-close" onClick={closeEditStoreModal}></button>
              </div>
              <div className="modal-body">
                <input className="form-control mb-2" name="name" value={editStoreForm.name} onChange={handleEditStoreChange} placeholder="Name" />
                <input className="form-control mb-2" name="address" value={editStoreForm.address} onChange={handleEditStoreChange} placeholder="Address" />
                <input className="form-control mb-2" name="owner_name" value={editStoreForm.owner_name} onChange={handleEditStoreChange} placeholder="Owner Name" />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeEditStoreModal}>Cancel</button>
                <button className="btn btn-success" onClick={saveStoreChanges}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
