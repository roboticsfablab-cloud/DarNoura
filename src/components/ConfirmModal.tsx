import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center animate-fade-in p-4">
      <div className="absolute inset-0 bg-snd-950/80 backdrop-blur-md" onClick={onCancel} />
      <div className="relative w-full max-w-md animate-scale-in">
        <div className="glass-card p-8 text-center">
          <div className="flex justify-center mb-5">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center ${
                danger ? 'bg-red-500/20' : 'bg-gold-400/20'
              }`}
            >
              <AlertTriangle className={`w-7 h-7 ${danger ? 'text-red-300' : 'text-gold-300'}`} />
            </div>
          </div>
          <h3 className="text-xl font-heading font-bold text-sand-50 mb-3">{title}</h3>
          <p className="text-sand-100/60 font-body text-sm mb-8 leading-relaxed">{message}</p>
          <div className="flex items-center gap-3 justify-center">
            <button
              onClick={onCancel}
              className="btn-ghost touch-manipulation no-select"
              aria-label={cancelLabel}
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`touch-manipulation no-select ${
                danger
                  ? 'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-red-200 bg-red-500/20 border border-red-500/40 transition-all hover:bg-red-500/30 active:scale-95'
                  : 'btn-gold'
              }`}
              aria-label={confirmLabel}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
