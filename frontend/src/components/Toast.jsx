import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export default function Toast({ type = 'info', message, onClose }) {
  if (!message) return null;

  const typeConfig = {
    success: { icon: CheckCircle, bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' },
    error: { icon: XCircle, bg: 'bg-rose-500/10 border-rose-500/30 text-rose-500' },
    warning: { icon: AlertTriangle, bg: 'bg-amber-500/10 border-amber-500/30 text-amber-500' },
    info: { icon: Info, bg: 'bg-brand-500/10 border-brand-500/30 text-brand-500' }
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-md shadow-lg ${config.bg} transition-all duration-300 max-w-md`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-xs font-medium text-gray-900 dark:text-gray-100 flex-1">
        {message}
      </p>
      {onClose && (
        <button onClick={onClose} className="p-1 hover:opacity-75">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
