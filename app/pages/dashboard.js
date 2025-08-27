import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import ProductUploadForm from '../components/ProductUploadForm';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser(data.session.user);
      } else {
        window.location.href = '/login';
      }
    });
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 800, margin: 'auto' }}>
      <h1>Welcome, {user.email}</h1>

      {/* Seller can upload products */}
      <ProductUploadForm user={user} />
    </div>
  );
}
