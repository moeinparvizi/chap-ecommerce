'use client';
import { enterDemo, resetDemo } from '../lib/demo';
export function DemoNotice() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') return null;
  return (
    <aside
      aria-label="حالت نمایشی"
      style={{
        background: '#172554',
        color: '#fff',
        padding: '10px 16px',
        fontSize: 12,
        display: 'flex',
        gap: 16,
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <span>نسخهٔ نمایشی · اطلاعات ساختگی · پرداخت واقعی انجام نمی‌شود</span>
      {(['admin', 'customer'] as const).map((role) => (
        <button
          key={role}
          onClick={async () => {
            try {
              window.location.href = await enterDemo(role);
            } catch {
              resetDemo();
              window.location.href = await enterDemo(role);
            }
          }}
          style={{ border: 0, background: 'transparent', color: '#bfdbfe', cursor: 'pointer' }}
        >
          {role === 'admin' ? 'دموی مدیریت' : 'دموی مشتری'}
        </button>
      ))}
      <button
        onClick={() => {
          resetDemo();
          window.location.href = '/';
        }}
        style={{
          border: '1px solid #93c5fd',
          borderRadius: 6,
          padding: '3px 10px',
          color: '#fff',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        بازنشانی دمو
      </button>
    </aside>
  );
}
