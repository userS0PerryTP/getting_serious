'use client'

import React, { useState } from 'react';

export default function ProductUploadForm({ user }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]); // Assume images URLs or base64 strings
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description) {
      setMessage('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setMessage('');

    const res = await fetch('/api/upload-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productName: name,
        productDescription: description,
        images,
        sellerId: user.id,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || 'Upload failed.');
    } else {
      setMessage('Product uploaded and awaiting admin approval!');
      setName('');
      setDescription('');
      setImages([]);
    }

    setLoading(false);
  };

  // For simplicity, image upload logic omitted here; you'd handle file uploads or URLs.

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>Upload Product</h2>

      <label>Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />

      <label>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />

      {/* Add your image upload inputs here */}

      <button type="submit" disabled={loading}>
        {loading ? 'Uploading...' : 'Upload Product'}
      </button>

      {message && <p style={{ marginTop: 15 }}>{message}</p>}
    </form>
  );
}
