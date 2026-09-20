import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api.js';
import { SectionHeading, Loader, Badge, Button, Tabs } from '../components/ui/UI.jsx';

const STATUS_TONE = { approved: 'peacock', pending: 'saffron', rejected: 'rose' };

function Stat({ label, value }) {
  return (
    <div className="card p-5">
      <div className="font-display text-3xl font-bold text-saffron-600">{value}</div>
      <div className="text-sm text-ink-soft">{label}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState('pending');
  const [vendors, setVendors] = useState({ loading: true, data: [] });
  const [users, setUsers] = useState([]);

  const loadStats = useCallback(() => { api.get('/admin/stats').then(setStats).catch(() => {}); }, []);
  const loadVendors = useCallback(() => {
    setVendors({ loading: true, data: [] });
    const qs = tab === 'all' ? '' : `?status=${tab}`;
    api.get(`/admin/vendors${qs}`).then((d) => setVendors({ loading: false, data: d })).catch(() => setVendors({ loading: false, data: [] }));
  }, [tab]);

  useEffect(() => { loadStats(); api.get('/admin/users').then(setUsers).catch(() => {}); }, [loadStats]);
  useEffect(() => { if (tab !== 'users') loadVendors(); }, [tab, loadVendors]);

  const setStatus = async (id, status) => {
    await api.patch(`/admin/vendors/${id}/status`, { status });
    loadVendors(); loadStats();
  };
  const toggleSponsor = async (v) => {
    await api.patch(`/admin/vendors/${v.id}/sponsor`, { is_sponsored: !v.is_sponsored });
    loadVendors();
  };

  return (
    <div className="container-bv py-10">
      <SectionHeading eyebrow="Admin" title="Admin dashboard" subtitle="Approve vendor listings, manage sponsorship and review users." />

      {stats && (
        <div className="mb-8 grid gap-4 grid-cols-2 lg:grid-cols-5">
          <Stat label="Users" value={stats.users} />
          <Stat label="Total vendors" value={stats.vendors_total} />
          <Stat label="Pending" value={stats.vendors_pending} />
          <Stat label="Approved" value={stats.vendors_approved} />
          <Stat label="Enquiries" value={stats.enquiries} />
        </div>
      )}

      <div className="mb-6"><Tabs tabs={[
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'all', label: 'All vendors' },
        { value: 'users', label: 'Users' },
      ]} active={tab} onChange={setTab} /></div>

      {tab === 'users' ? (
        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-sand-100 text-ink-soft"><tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Joined</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-sand-200">
                  <td className="p-3 font-medium">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3"><Badge tone={u.role === 'admin' ? 'ink' : u.role === 'vendor' ? 'peacock' : 'sand'}>{u.role}</Badge></td>
                  <td className="p-3 text-ink-soft">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : vendors.loading ? <Loader /> : vendors.data.length === 0 ? (
        <div className="card p-6 text-ink-soft">No vendors in this view.</div>
      ) : (
        <div className="space-y-3">
          {vendors.data.map((v) => (
            <div key={v.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{v.business_name}</h4>
                  <Badge tone={STATUS_TONE[v.status]}>{v.status}</Badge>
                  {v.is_sponsored ? <Badge tone="ink">Sponsored</Badge> : null}
                </div>
                <p className="text-sm text-ink-soft">{v.category} · {[v.city, v.state].filter(Boolean).join(', ')}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {v.status !== 'approved' && <Button variant="peacock" onClick={() => setStatus(v.id, 'approved')}>Approve</Button>}
                {v.status !== 'rejected' && <Button variant="ghost" onClick={() => setStatus(v.id, 'rejected')}>Reject</Button>}
                <Button variant="ghost" onClick={() => toggleSponsor(v)}>{v.is_sponsored ? 'Unsponsor' : 'Mark sponsored'}</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
