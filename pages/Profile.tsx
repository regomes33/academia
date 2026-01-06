import React, { useState } from 'react';
import { Moon, Sun, Timer, Trash2, Download, ChevronRight, User as UserIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { clearAllData, exportData } from '../services/storageService';
import { getPlanById } from '../data/workoutPlans';

interface ProfileProps {
    onSelectPlan: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onSelectPlan }) => {
    const { settings, updateSettings, toggleDarkMode } = useApp();
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [userName, setUserName] = useState(settings.userName || '');
    const [isEditingName, setIsEditingName] = useState(false);

    const selectedPlan = settings.selectedPlanId ? getPlanById(settings.selectedPlanId) : null;

    const restTimerOptions = [
        { value: 30, label: '30s' },
        { value: 60, label: '1 min' },
        { value: 90, label: '1:30' },
        { value: 120, label: '2 min' },
        { value: 180, label: '3 min' },
    ];

    const handleSaveName = () => {
        updateSettings({ userName: userName.trim() || undefined });
        setIsEditingName(false);
    };

    const handleExport = () => {
        const data = exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ppl-workout-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleClearData = () => {
        clearAllData();
        updateSettings({ selectedPlanId: null, userName: undefined });
        setShowClearConfirm(false);
        window.location.reload();
    };

    return (
        <div className="min-h-screen pb-24 px-4 pt-4">
            {/* Header */}
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-white">Perfil</h1>
                <p className="text-gray-400">Configurações e preferências</p>
            </header>

            {/* User Info */}
            <section className="mb-6">
                <div className="p-4 bg-surface-dark rounded-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                            <UserIcon className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex-1">
                            {isEditingName ? (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        placeholder="Seu nome"
                                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                                        autoFocus
                                    />
                                    <button
                                        onClick={handleSaveName}
                                        className="px-4 py-2 bg-primary rounded-lg text-background-dark font-medium"
                                    >
                                        Salvar
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsEditingName(true)}
                                    className="text-left"
                                >
                                    <p className="text-white font-semibold text-lg">
                                        {settings.userName || 'Toque para adicionar nome'}
                                    </p>
                                    <p className="text-gray-400 text-sm">Atleta PPL</p>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Current Plan */}
            <section className="mb-6">
                <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-3">
                    Plano de Treino
                </h2>
                <button
                    onClick={onSelectPlan}
                    className="w-full flex items-center justify-between p-4 bg-surface-dark rounded-xl hover:bg-surface-dark/80 transition-colors"
                >
                    <div>
                        <p className="text-white font-medium">
                            {selectedPlan ? selectedPlan.title : 'Nenhum plano selecionado'}
                        </p>
                        <p className="text-gray-400 text-sm">
                            {selectedPlan ? `${selectedPlan.daysPerWeek} dias/semana` : 'Toque para selecionar'}
                        </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
            </section>

            {/* Settings */}
            <section className="mb-6">
                <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-3">
                    Configurações
                </h2>
                <div className="space-y-2">
                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="w-full flex items-center justify-between p-4 bg-surface-dark rounded-xl"
                    >
                        <div className="flex items-center gap-3">
                            {settings.darkMode ? (
                                <Moon className="w-5 h-5 text-primary" />
                            ) : (
                                <Sun className="w-5 h-5 text-yellow-400" />
                            )}
                            <span className="text-white">Modo Escuro</span>
                        </div>
                        <div className={`w-12 h-7 rounded-full p-1 transition-colors ${settings.darkMode ? 'bg-primary' : 'bg-gray-600'
                            }`}>
                            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.darkMode ? 'translate-x-5' : 'translate-x-0'
                                }`} />
                        </div>
                    </button>

                    {/* Rest Timer Duration */}
                    <div className="p-4 bg-surface-dark rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                            <Timer className="w-5 h-5 text-primary" />
                            <span className="text-white">Timer de Descanso</span>
                        </div>
                        <div className="flex gap-2">
                            {restTimerOptions.map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => updateSettings({ restTimerDuration: option.value })}
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${settings.restTimerDuration === option.value
                                            ? 'bg-primary text-background-dark'
                                            : 'bg-white/5 text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Data Management */}
            <section>
                <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-3">
                    Dados
                </h2>
                <div className="space-y-2">
                    {/* Export Data */}
                    <button
                        onClick={handleExport}
                        className="w-full flex items-center justify-between p-4 bg-surface-dark rounded-xl hover:bg-surface-dark/80 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Download className="w-5 h-5 text-blue-400" />
                            <span className="text-white">Exportar Dados</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>

                    {/* Clear Data */}
                    <button
                        onClick={() => setShowClearConfirm(true)}
                        className="w-full flex items-center justify-between p-4 bg-surface-dark rounded-xl hover:bg-red-500/10 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Trash2 className="w-5 h-5 text-red-400" />
                            <span className="text-red-400">Limpar Todos os Dados</span>
                        </div>
                    </button>
                </div>
            </section>

            {/* Clear Confirmation Modal */}
            {showClearConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => setShowClearConfirm(false)}
                    />
                    <div className="relative w-full max-w-sm bg-surface-dark rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-2">Limpar Dados?</h3>
                        <p className="text-gray-400 mb-6">
                            Esta ação irá apagar todos os seus treinos e configurações. Esta ação não pode ser desfeita.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowClearConfirm(false)}
                                className="flex-1 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleClearData}
                                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                            >
                                Limpar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* App Version */}
            <p className="text-center text-gray-600 text-xs mt-8">
                PPL Workout Tracker v1.0.0
            </p>
        </div>
    );
};

export default Profile;
