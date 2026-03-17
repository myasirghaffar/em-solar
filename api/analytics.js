import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      // Get total sales
      const { data: orders } = await supabase.from('orders').select('total_price');
      const totalSales = orders?.reduce((sum, o) => sum + (o.total_price || 0), 0) || 0;
      const totalOrders = orders?.length || 0;
      
      // Get total customers
      const { count: totalCustomers } = await supabase.from('customers').select('*', { count: 'exact', head: true });
      
      // Get total products
      const { count: totalProducts } = await supabase.from('products').select('*', { count: 'exact', head: true });
      
      // Get monthly sales data
      const { data: monthlyOrders } = await supabase
        .from('orders')
        .select('total_price, created_at')
        .order('created_at', { ascending: true });
      
      const monthlySales = Array(12).fill(0).map((_, i) => {
        const month = new Date().setMonth(i);
        return monthlyOrders?.filter(o => {
          const orderDate = new Date(o.created_at);
          return orderDate.getMonth() === i && orderDate.getFullYear() === new Date().getFullYear();
        }).reduce((sum, o) => sum + (o.total_price || 0), 0) || 0;
      });
      
      const orderGrowth = Array(12).fill(0).map((_, i) => {
        return monthlyOrders?.filter(o => {
          const orderDate = new Date(o.created_at);
          return orderDate.getMonth() === i && orderDate.getFullYear() === new Date().getFullYear();
        }).length || 0;
      });
      
      return res.status(200).json({
        totalSales,
        totalOrders,
        totalCustomers: totalCustomers || 0,
        totalProducts: totalProducts || 0,
        monthlySales,
        orderGrowth
      });
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}