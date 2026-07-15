'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Icons } from '../components/Icons';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

interface NotificationContextType {
  toast: (type: Toast['type'], message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType>({
  toast: () => {},
  success: () => {},
  error: () => {},
  warning: () => {},
  info: () => {},
  confirm: async () => false,
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmState, setConfirmState] = useState<{
    show: boolean;
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  }>({ show: false, options: { message: '' }, resolve: () => {} });

  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({ show: true, options, resolve });
    });
  }, []);

  const handleConfirm = (value: boolean) => {
    confirmState.resolve(value);
    setConfirmState(prev => ({ ...prev, show: false }));
  };

  const typeConfig = {
    success: { icon: <Icons.Check size={18} />, color: '#22c55e', bg: 'rgba(22,197,94,0.15)', border: 'rgba(22,197,94,0.3)' },
    error: { icon: <Icons.X size={18} />, color: '#ef4444', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)' },
    warning: { icon: <Icons.AlertCircle size={18} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)' },
    info: { icon: <Icons.Mail size={18} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)' },
  };

  return (
    <NotificationContext.Provider value={{ toast: addToast, success: (m) => addToast('success', m), error: (m) => addToast('error', m), warning: (m) => addToast('warning', m), info: (m) => addToast('info', m), confirm }}>
      {children}

      {/* Toast Container */}
      <div style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 10000, display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        {toasts.map(toast => {
          const config = typeConfig[toast.type];
          return (
            <div key={toast.id} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '14px 20px', borderRadius: '12px',
              background: 'var(--card-bg)', border: `1px solid ${config.border}`,
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              animation: 'toastIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: config.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: config.color, flexShrink: 0 }}>
                {config.icon}
              </div>
              <span style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 500 }}>{toast.message}</span>
              <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px', marginLeft: 'auto', flexShrink: 0 }}>
                <Icons.X size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Confirm Modal */}
      {confirmState.show && (
        <div className="modal-overlay" onClick={() => handleConfirm(false)} style={{ animation: 'fadeIn 0.2s ease-out' }}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: confirmState.options.type === 'danger' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: confirmState.options.type === 'danger' ? '#ef4444' : '#f59e0b' }}>
              <Icons.AlertCircle size={28} />
            </div>
            {confirmState.options.title && <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>{confirmState.options.title}</h3>}
            <p style={{ margin: '0 0 24px', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{confirmState.options.message}</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => handleConfirm(false)} className="btn btn-ghost" style={{ flex: 1 }}>{confirmState.options.cancelText || 'انصراف'}</button>
              <button onClick={() => handleConfirm(true)} className={confirmState.options.type === 'danger' ? 'btn btn-danger' : 'btn btn-primary'} style={{ flex: 1 }}>{confirmState.options.confirmText || 'تایید'}</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-30px) scale(0.95); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
