import React, { useEffect } from 'react';
import { CheckCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
}

function ToastItem({ toast, removeToast }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast, removeToast]);

  const Icon = toast.type === 'success' ? CheckCircle : Info;

  return (
    <div className="toast">
      <Icon size={20} color={toast.type === 'success' ? 'var(--accent-green)' : 'var(--accent-blue)'} />
      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{toast.message}</span>
      <button 
        onClick={() => removeToast(toast.id)} 
        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: '1rem' }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
