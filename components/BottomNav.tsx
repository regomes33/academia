import React from 'react';
import { Home, History, User } from 'lucide-react';

interface BottomNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const tabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'history', label: 'Histórico', icon: History },
    { id: 'profile', label: 'Perfil', icon: User },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
    // Find active tab index for sliding indicator
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);

    return (
        <nav
            className="fixed bottom-0 left-0 w-full bg-surface-dark/95 backdrop-blur border-t border-white/5 z-50"
            role="navigation"
            aria-label="Navegação principal"
        >
            {/* Animated sliding indicator */}
            <div
                className="absolute top-0 h-0.5 bg-primary transition-all duration-300 ease-spring"
                style={{
                    width: `${100 / tabs.length}%`,
                    transform: `translateX(${activeIndex * 100}%)`,
                    boxShadow: '0 0 8px rgba(19, 236, 19, 0.6)',
                }}
                aria-hidden="true"
            />

            <div className="flex items-center justify-around h-16 pb-safe-area-inset-bottom">
                {tabs.map(({ id, label, icon: Icon }, index) => {
                    const isActive = activeTab === id;
                    return (
                        <button
                            key={id}
                            onClick={() => onTabChange(id)}
                            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-250 interactive ${isActive
                                ? 'text-primary'
                                : 'text-text-secondary hover:text-white'
                                }`}
                            aria-label={label}
                            aria-current={isActive ? 'page' : undefined}
                            role="tab"
                            aria-selected={isActive}
                        >
                            <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform duration-250 ease-spring`}>
                                <Icon className="w-6 h-6" />
                                {/* Glow effect on active */}
                                {isActive && (
                                    <div
                                        className="absolute inset-0 -z-10 blur-md"
                                        style={{
                                            background: 'radial-gradient(circle, rgba(19, 236, 19, 0.4) 0%, transparent 70%)',
                                        }}
                                        aria-hidden="true"
                                    />
                                )}
                            </div>
                            <span className={`text-xs font-medium ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                                {label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
