import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { productName, productDescription, images, sellerId } = req.body;

  if (!productName || !productDescription || !images || !sellerId) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    // Insert product with status = 'pending'
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name: productName,
          description: productDescription,
          images,
          seller_id: sellerId,
          status: 'pending', // admin must approve later
        },
      ]);

    if (error) return res.status(400).json({ error: error.message });

    // TODO: Insert audit log for product upload

    res.status(200).json({ message: 'Product uploaded, awaiting admin approval.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
