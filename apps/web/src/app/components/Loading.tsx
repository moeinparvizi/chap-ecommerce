'use client';

import { Icons } from './Icons';

export function PageLoader() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: '16px' }}>
      <div className="loader-spinner" />
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>در حال بارگذاری...</p>
    </div>
  );
}

export function CardLoader({ count = 4 }: { count?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card" style={{ overflow: 'hidden' }}>
          <div className="skeleton" style={{ height: '200px', borderRadius: '0' }} />
          <div style={{ padding: '16px' }}>
            <div className="skeleton" style={{ height: '12px', width: '60%', marginBottom: '8px' }} />
            <div className="skeleton" style={{ height: '16px', width: '90%', marginBottom: '8px' }} />
            <div className="skeleton" style={{ height: '16px', width: '70%', marginBottom: '12px' }} />
            <div className="skeleton" style={{ height: '36px', width: '100%', borderRadius: '10px' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ListLoader({ count = 3 }: { count?: number }) {
  return (
    <div style={{ display: 'grid', gap: '12px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="skeleton" style={{ width: '80px', height: '80px', borderRadius: '12px', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ height: '14px', width: '40%', marginBottom: '8px' }} />
            <div className="skeleton" style={{ height: '12px', width: '70%', marginBottom: '8px' }} />
            <div className="skeleton" style={{ height: '12px', width: '50%' }} />
          </div>
          <div className="skeleton" style={{ width: '80px', height: '32px', borderRadius: '8px', flexShrink: 0 }} />
        </div>
      ))}
    </div>
  );
}

export function StatsLoader() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ height: '12px', width: '60%', marginBottom: '6px' }} />
            <div className="skeleton" style={{ height: '18px', width: '40%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableLoader({ rows = 4 }: { rows?: number }) {
  return (
    <div className="card" style={{ padding: '20px' }}>
      <div className="skeleton" style={{ height: '20px', width: '120px', marginBottom: '16px' }} />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: '16px', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
          <div className="skeleton" style={{ height: '14px', width: '100px', flexShrink: 0 }} />
          <div className="skeleton" style={{ height: '14px', width: '120px', flexShrink: 0 }} />
          <div className="skeleton" style={{ height: '14px', width: '80px', flexShrink: 0 }} />
          <div className="skeleton" style={{ height: '14px', width: '60px', flexShrink: 0 }} />
        </div>
      ))}
    </div>
  );
}

export function SidebarLoader() {
  return (
    <div style={{ width: '260px', flexShrink: 0 }}>
      <div className="card" style={{ padding: '20px' }}>
        <div className="skeleton" style={{ height: '20px', width: '80px', marginBottom: '20px' }} />
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ marginBottom: '8px' }}>
            <div className="skeleton" style={{ height: '32px', width: '100%', borderRadius: '8px' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfileLoader() {
  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <div className="skeleton" style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 16px' }} />
      <div className="skeleton" style={{ height: '18px', width: '120px', margin: '0 auto 8px' }} />
      <div className="skeleton" style={{ height: '14px', width: '180px', margin: '0 auto 24px' }} />
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ marginBottom: '12px', maxWidth: '400px', margin: '0 auto 12px' }}>
          <div className="skeleton" style={{ height: '12px', width: '80px', marginBottom: '6px' }} />
          <div className="skeleton" style={{ height: '40px', width: '100%', borderRadius: '8px' }} />
        </div>
      ))}
    </div>
  );
}
