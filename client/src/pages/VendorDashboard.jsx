import { useFetch } from '../lib/useFetch.js';
import { useAuth } from '../lib/auth.jsx';
import { SectionHeading, Loader, Badge, Button } from '../components/ui/UI.jsx';

const STATUS_TONE = { approved: 'peacock', pending: 'saffron', rejected: 'rose' };

export default function VendorDashboard() {
  const { user } = useAuth();
  const listings = useFetch('/my/vendors', []);
  const enquiries = useFetch('/my/enquiries', []);

  return (
    <div className="container-bv py-10">
      <SectionHeading
        eyebrow={`Vendor · ${user?.name}`}
        title="Vendor dashboard"
        subtitle="Manage your listings and view enquiries."
        action={<Button variant="primary" to="/vendor/register">Add a listing</Button>}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h3 className="mb-3 font-display text-xl font-semibold">My listings</h3>
          {listings.loading ? <Loader /> : (listings.data || []).length === 0 ? (
            <div className="card p-6 text-ink-soft">No listings yet.</div>
          ) : (
            <div className="space-y-3">
              {listings.data.map((v) => (
                <div key={v.id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{v.business_name}</h4>
                    <Badge tone={STATUS_TONE[v.status]}>{v.status}</Badge>
                  </div>
                  <p className="text-sm text-ink-soft">{v.category} · {[v.city, v.state].filter(Boolean).join(', ')}</p>
                  {v.is_sponsored ? <Badge tone="ink" className="mt-2">Sponsored</Badge> : null}
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h3 className="mb-3 font-display text-xl font-semibold">Enquiries received</h3>
          {enquiries.loading ? <Loader /> : (enquiries.data || []).length === 0 ? (
            <div className="card p-6 text-ink-soft">No enquiries yet. When travellers contact your listings, they'll appear here.</div>
          ) : (
            <div className="space-y-3">
              {enquiries.data.map((e) => (
                <div key={e.id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{e.user_name}</h4>
                    <span className="text-xs text-ink-soft">{new Date(e.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-ink-soft">re: {e.business_name}{e.contact ? ` · ${e.contact}` : ''}</p>
                  <p className="mt-1 text-sm text-ink-soft">{e.message}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
