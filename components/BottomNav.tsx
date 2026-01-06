import React from 'react';
import { Home, History, User } from 'lucide-react';

interface BottomNavProps {
    activeTab: 'home' | 'history' | 'profile';
    onTabChange: (tab: 'home' | 'history' | 'profile') => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'home' as const, label: 'Treino', icon: Home },
        { id: 'history' as const, label: 'Histórico', icon: History },
        { id: 'profile' as const, label: 'Perfil', icon: User }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-dark/95 backdrop-blur-lg border-t border-white/5">
            <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
                {tabs.map(({ id, label, icon: Icon }) => {
                    const isActive = activeTab === id;
                    return (
                        <button
                            key={id}
                            onClick={() => onTabChange(id)}
                            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-200 ${isActive
                                    ? 'text-primary'
                                    : 'text-gray-500 hover:text-gray-300'
                                }`}
                            aria-label={label}
                        >
                            <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform`}>
                                <Icon className="w-6 h-6" />
                                {isActive && (
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                                )}
                            </div>
                            <span className={`text-xs font-medium ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                                {label}
                            </span>
                        </button>
                    );
                })}
            </div>
            {/* Safe area padding for mobile devices */}
            <div className="h-safe-area-inset-bottom bg-surface-dark" />
        </nav>
    );
};

export default BottomNav;
