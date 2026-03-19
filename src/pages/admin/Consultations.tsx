import { useEffect, useState } from 'react';
import { Search, Phone, MapPin, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function AdminConsultations() {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const { fetchConsultations: apiFetchConsultations } = await import('../../lib/api');
      const data = await apiFetchConsultations();
      setConsultations(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const { updateConsultationStatus } = await import('../../lib/api');
      await updateConsultationStatus(id, status);
      fetchConsultations();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch =
      consultation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.phone?.includes(searchTerm) ||
      consultation.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || consultation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusConfig: Record<string, { icon: any; color: string; bgColor: string }> = {
    new: { icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    contacted: { icon: Phone, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    converted: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
    closed: { icon: XCircle, color: 'text-gray-600', bgColor: 'bg-gray-100' }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0B2A4A]">Consultation Leads</h1>
        <p className="text-gray-600">Manage solar consultation requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="New Leads" count={consultations.filter(c => c.status === 'new').length} color="blue" />
        <StatCard title="Contacted" count={consultations.filter(c => c.status === 'contacted').length} color="yellow" />
        <StatCard title="Converted" count={consultations.filter(c => c.status === 'converted').length} color="green" />
        <StatCard title="Total Leads" count={consultations.length} color="gray" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Consultations Table */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="overflow-x-auto touch-pan-x w-full">
          <table className="w-max">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Lead</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Monthly Bill</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7A00] mx-auto" />
                  </td>
                </tr>
              ) : filteredConsultations.length > 0 ? (
                filteredConsultations.map(consultation => {
                  const config = statusConfig[consultation.status] || statusConfig.new;
                  const Icon = config.icon;
                  return (
                    <tr key={consultation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bgColor}`}>
                            <Icon className={`w-5 h-5 ${config.color}`} />
                          </div>
                          <div>
                            <p className="font-medium text-[#0B2A4A] whitespace-nowrap">{consultation.name}</p>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <MapPin className="w-3 h-3" />
                              <span>{consultation.city}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm text-gray-700">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{consultation.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {consultation.monthly_bill ? `Rs. ${consultation.monthly_bill}` : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-2">
                          <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700 max-w-xs line-clamp-2">{consultation.message}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={consultation.status || 'new'}
                          onChange={(e) => updateStatus(consultation.id, e.target.value)}
                          className={`px-2 py-1 text-xs font-medium rounded-full border-0 ${config.bgColor} ${config.color}`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="converted">Converted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(consultation.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={`tel:${consultation.phone}`}
                          className="inline-flex items-center space-x-1 px-3 py-1 bg-[#FF7A00] text-white text-sm rounded-lg hover:bg-[#FF7A00]/90 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          <span>Call</span>
                        </a>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">No consultation leads found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, count, color }: { title: string; count: number; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    gray: 'bg-gray-500'
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-[#0B2A4A]">{count}</p>
        </div>
        <div className={`w-12 h-12 ${colors[color]} rounded-lg flex items-center justify-center`}>
          <FileText className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}