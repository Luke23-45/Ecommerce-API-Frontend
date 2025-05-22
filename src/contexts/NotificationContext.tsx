// src/contexts/NotificationContext.tsx
import React, { createContext, useContext, useState, useCallback, type ReactNode, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid'; // For unique IDs
import { FaTimes } from 'react-icons/fa'; // Icon for dismiss button

import { AdminNotification as StyledAdminNotification } from '@/components/admin/Dashboard/Common/Common.styles';

// --- 1. INTERFACES & TYPES ---
export interface NotificationMessage {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}

interface NotificationContextType {
    showNotification: (message: string, type?: NotificationMessage['type'], duration?: number) => void;
}

// --- 2. INTERNAL COMPONENT: NotificationDisplay ---
// This component should be defined *before* NotificationProvider uses it.
interface NotificationDisplayProps {
    notifications: NotificationMessage[];
    onDismiss: (id: string) => void;
}

const NotificationDisplay: React.FC<NotificationDisplayProps> = ({ notifications, onDismiss }) => {
    return (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notifications.map(notification => (
                <StyledAdminNotification
                    key={notification.id}
                    $type={notification.type}
                    className="show" // Always show this, as `notifications` state manages its existence
                    style={{ position: 'static', transform: 'translateX(0)', opacity: 1 }} // Override default fixed/animated states for stacking
                >
                    {notification.message}
                    <button onClick={() => onDismiss(notification.id)} style={{ background: 'none', border: 'none', color: 'inherit', marginLeft: '10px', cursor: 'pointer' }}>
                        <FaTimes />
                    </button>
                </StyledAdminNotification>
            ))}
        </div>
    );
};


// --- 3. CONTEXT & PROVIDER ---
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

    const showNotification = useCallback((message: string, type: NotificationMessage['type'] = 'info', duration: number = 3000) => {
        const newNotification: NotificationMessage = {
            id: uuidv4(),
            message,
            type,
            duration,
        };
        setNotifications(prev => [...prev, newNotification]);
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    // Effect to auto-dismiss notifications
    useEffect(() => {
        if (notifications.length > 0) {
            const timerIds: NodeJS.Timeout[] = [];
            notifications.forEach(notification => {
                if (notification.duration && notification.duration > 0) {
                    const timer = setTimeout(() => {
                        removeNotification(notification.id);
                    }, notification.duration);
                    timerIds.push(timer);
                }
            });
            return () => {
                timerIds.forEach(clearTimeout);
            };
        }
    }, [notifications, removeNotification]);

    const contextValue = useMemo(() => ({ showNotification }), [showNotification]);

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
            {/* NotificationDisplay is now defined above, so it can be used here */}
            <NotificationDisplay notifications={notifications} onDismiss={removeNotification} />
        </NotificationContext.Provider>
    );
};


// --- 4. CUSTOM HOOK ---
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};