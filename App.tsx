import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import PlanSelection from './pages/PlanSelection';
import Workout from './pages/Workout';
import History from './pages/History';
import Profile from './pages/Profile';
import { DayType } from './types';

type Screen = 'dashboard' | 'plan-selection' | 'workout' | 'history' | 'profile';

const AppContent: React.FC = () => {
  const { currentSession, startWorkout, endWorkout, settings } = useApp();
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'profile'>('home');
  const navigate = useNavigate();

  // Auto-redirect to workout if there's an active session
  React.useEffect(() => {
    if (currentSession) {
      navigate('/workout');
    }
  }, [currentSession, navigate]);

  const handleTabChange = (tab: 'home' | 'history' | 'profile') => {
    setActiveTab(tab);
    if (tab === 'home') navigate('/');
    if (tab === 'history') navigate('/history');
    if (tab === 'profile') navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-background-dark text-white">
      <main className="px-4 pt-4 pb-20">
        <Outlet />
      </main>
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};


const DashboardWrapper: React.FC = () => {
  const { currentSession, startWorkout, settings } = useApp();
  const navigate = useNavigate();

  const handleStartWorkout = (dayType: DayType) => {
    if (currentSession) {
      navigate('/workout');
    } else if (!settings.selectedPlanId) {
      navigate('/plan-selection');
    } else {
      startWorkout(dayType);
      // Navigation to /workout will be handled by the useEffect in AppContent
    }
  };

  return (
    <Dashboard
      onStartWorkout={handleStartWorkout}
      onSelectPlan={() => navigate('/plan-selection')}
    />
  );
};

const WorkoutWrapper: React.FC = () => {
  const { endWorkout } = useApp();
  const navigate = useNavigate();

  const handleFinishWorkout = () => {
    endWorkout(true);
    navigate('/');
  };

  return (
    <Workout
      onBack={() => navigate('/')}
      onFinish={handleFinishWorkout}
    />
  );
};

const PlanSelectionWrapper: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PlanSelection
      onBack={() => navigate('/')}
      onPlanSelected={() => navigate('/')}
    />
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<PrivateRoute />}>
              <Route element={<AppContent />}>
                <Route path="/" element={<DashboardWrapper />} />
                <Route path="/history" element={<History />} />
                <Route path="/profile" element={<Profile onSelectPlan={() => { }} />} />
              </Route>
              <Route path="/plan-selection" element={<PlanSelectionWrapper />} />
              <Route path="/workout" element={<WorkoutWrapper />} />
            </Route>
          </Routes>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
