import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    showToast: (type: ToastType, message: string, duration?: number) => void;
    dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((type: ToastType, message: string, duration = 4000) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newToast: Toast = { id, type, message, duration };

        setToasts(prev => [...prev, newToast]);

        // Auto dismiss
        if (duration > 0) {
            setTimeout(() => {
                dismissToast(id);
            }, duration);
        }
    }, []);

    const dismissToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </ToastContext.Provider>
    );
};

interface ToastContainerProps {
    toasts: Toast[];
    onDismiss: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
    if (toasts.length === 0) return null;

    return (
        <div
            className="fixed top-4 right-4 left-4 z-[1060] flex flex-col gap-2 pointer-events-none sm:left-auto sm:w-80"
            role="region"
            aria-label="Notificações"
            aria-live="polite"
        >
            {toasts.map((toast) => (
                <ToastItem
                    key={toast.id}
                    toast={toast}
                    onDismiss={() => onDismiss(toast.id)}
                />
            ))}
        </div>
    );
};

interface ToastItemProps {
    toast: Toast;
    onDismiss: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
    const icons = {
        success: <CheckCircle className="w-5 h-5 text-primary" />,
        error: <XCircle className="w-5 h-5 text-accent-red" />,
        info: <Info className="w-5 h-5 text-accent-blue" />,
        warning: <AlertTriangle className="w-5 h-5 text-accent-yellow" />,
    };

    const backgrounds = {
        success: 'bg-primary/10 border-primary/30',
        error: 'bg-accent-red/10 border-accent-red/30',
        info: 'bg-accent-blue/10 border-accent-blue/30',
        warning: 'bg-accent-yellow/10 border-accent-yellow/30',
    };

    return (
        <div
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-sm border backdrop-blur-sm animate-slide-right ${backgrounds[toast.type]}`}
            role="alert"
        >
            {icons[toast.type]}
            <p className="flex-1 text-sm font-medium text-white">{toast.message}</p>
            <button
                onClick={onDismiss}
                className="p-1 rounded-sm hover:bg-white/10 transition-colors"
                aria-label="Fechar notificação"
            >
                <X className="w-4 h-4 text-text-secondary" />
            </button>
        </div>
    );
};

export default ToastProvider;
