import { useEffect, useState } from 'react';
import { DollarSign, ShoppingCart, Users, Package, TrendingUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    fetchRecentOrders();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { fetchAnalytics: apiFetchAnalytics } = await import('../../lib/api');
      const data = await apiFetchAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const { fetchOrders } = await import('../../lib/api');
      const data = await fetchOrders();
      setRecentOrders(data.slice(0, 5));
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7A00]" />
      </div>
    );
  }

  const salesData = analytics?.monthlySales?.map((value: number, index: number) => ({
    month: months[index],
    sales: value
  })) || [];

  const ordersData = analytics?.orderGrowth?.map((value: number, index: number) => ({
    month: months[index],
    orders: value
  })) || [];

  return (
    <div className="space-y-6 min-w-0 w-full max-w-full">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-[#0B2A4A]">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-w-0">
        <StatCard
          title="Total Sales"
          value={`Rs. ${(analytics?.totalSales || 0).toLocaleString()}`}
          icon={DollarSign}
          trend="+12.5%"
          trendUp={true}
        />
        <StatCard
          title="Total Orders"
          value={analytics?.totalOrders || 0}
          icon={ShoppingCart}
          trend="+8.2%"
          trendUp={true}
        />
        <StatCard
          title="Total Customers"
          value={analytics?.totalCustomers || 0}
          icon={Users}
          trend="+5.1%"
          trendUp={true}
        />
        <StatCard
          title="Total Products"
          value={analytics?.totalProducts || 0}
          icon={Package}
          trend="+2.3%"
          trendUp={true}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <h2 className="text-lg font-bold text-[#0B2A4A] mb-4">Monthly Sales</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0B2A4A',
                  border: 'none',
                  borderRadius: '8px'
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="sales" stroke="#FF7A00" fill="#FF7A00" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <h2 className="text-lg font-bold text-[#0B2A4A] mb-4">Orders Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0B2A4A',
                  border: 'none',
                  borderRadius: '8px'
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="orders" fill="#0B2A4A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-md min-w-0 overflow-hidden">
        <div className="p-4 sm:p-6 border-b">
          <h2 className="text-lg font-bold text-[#0B2A4A]">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto overflow-y-visible touch-pan-x min-w-0 admin-table-scroll">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0B2A4A]">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#FF7A00]">
                    Rs. {order.total_price?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.order_status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.order_status || 'pending'}
                    </span>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No orders yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, trendUp }: any) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 min-w-0">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FF7A00]/10 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-[#FF7A00]" />
        </div>
        <div className={`flex items-center space-x-1 ${
          trendUp ? 'text-green-600' : 'text-red-600'
        }`}>
          <TrendingUp className={`w-4 h-4 ${!trendUp && 'rotate-180'}`} />
          <span className="text-sm font-medium">{trend}</span>
        </div>
      </div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-[#0B2A4A]">{value}</p>
    </div>
  );
}