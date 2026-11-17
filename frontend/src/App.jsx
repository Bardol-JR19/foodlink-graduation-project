import React, { useState, useEffect } from 'react';

function App() {
  const [donations, setDonations] = useState([]);
  const [form, setForm] = useState({ food_type: '', quantity: '', expiry_date: '', address: '' });

  const fetchDonations = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/donations');
      const data = await res.json();
      setDonations(data);
    } catch (err) {
      console.error("Error fetching donations", err);
    }
  };

  useEffect(() => { fetchDonations(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/donations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setForm({ food_type: '', quantity: '', expiry_date: '', address: '' });
      fetchDonations();
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial', maxWidth: '600px', margin: '0 auto' }}>
      <h1>FoodLink - Week 4 Prototype</h1>
      
      <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
        <h3>Create a Food Donation</h3>
        <div style={{ marginBottom: '10px' }}>
          <input style={{ width: '100%', padding: '8px' }} placeholder="Food type (e.g., Fresh Bread)" value={form.food_type} onChange={e => setForm({...form, food_type: e.target.value})} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input style={{ width: '100%', padding: '8px' }} type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input style={{ width: '100%', padding: '8px' }} type="date" value={form.expiry_date} onChange={e => setForm({...form, expiry_date: e.target.value})} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input style={{ width: '100%', padding: '8px' }} placeholder="Pickup Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
        </div>
        <button type="submit" style={{ background: '#28a745', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Donation</button>
      </form>

      <h3>Available Donations</h3>
      <ul style={{ paddingLeft: '20px' }}>
        {Array.isArray(donations) && donations.map(d => (
          <li key={d.id} style={{ marginBottom: '8px' }}>
            <strong>{d.food_type}</strong> (Qty: {d.quantity}) - Expires on: {d.expiry_date ? d.expiry_date.split('T')[0] : ''} - Address: {d.address}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;