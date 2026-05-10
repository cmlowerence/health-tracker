import { useEffect, useState } from 'react';
import useStore from './store/useStore';
import Header from './components/Header';
import TimelineCard from './components/TimelineCard';
import EntryModal from './components/EntryModal';
import BottomNav from './components/BottomNav';
import HistoryTab from './components/HistoryTab';
import { Activity } from 'lucide-react';

export default function App() {
  const { isLoaded, initApp, selectedDate, logs, syncWithCloud, activeTab } = useStore();
  const [activeModal, setActiveModal] = useState(null);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    initApp();

    const identity = window.netlifyIdentity;
    if (!identity) {
      setAuthError('Identity widget failed to load.');
      return;
    }

    // 1. Define the handlers
    const handleInit = (userObj) => setUser(userObj || null);
    const handleLogin = (userObj) => {
      setAuthError('');
      setUser(userObj);
      identity.close();
    };
    const handleLogout = () => setUser(null);
    const handleError = (err) => {
      console.error('Netlify Identity error:', err);
      setAuthError(err?.message || 'Login failed.');
    };

    // 2. Attach the listeners FIRST
    identity.on('init', handleInit);
    identity.on('login', handleLogin);
    identity.on('logout', handleLogout);
    identity.on('error', handleError);

    // 3. Call init() LAST so it properly triggers the 'init' event on redirect
    identity.init();

    return () => {
      identity.off('init', handleInit);
      identity.off('login', handleLogin);
      identity.off('logout', handleLogout);
      identity.off('error', handleError);
    };
  }, [initApp]);

  useEffect(() => {
    if (user) {
      syncWithCloud(user);
      const handleOnline = () => syncWithCloud(user);
      window.addEventListener('online', handleOnline);
      return () => window.removeEventListener('online', handleOnline);
    }
  }, [user, syncWithCloud]);

  const handleGoogleLogin = () => {
    if (!window.netlifyIdentity) {
      setAuthError('Identity widget is unavailable.');
      return;
    }

    setAuthError('');

    try {
      window.netlifyIdentity.open('login', { provider: 'google' });
    } catch {
      window.netlifyIdentity.open();
    }
  };

  if (!isLoaded) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-400">Loading VitalTrack...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-emerald-600 flex flex-col items-center justify-center p-6 text-white text-center print:hidden">
        <Activity className="w-20 h-20 mb-6 text-emerald-100" />
        <h1 className="text-4xl font-bold mb-2">VitalTrack</h1>
        <p className="text-emerald-100 mb-10 text-lg">Your personal, offline-first health journal.</p>
        <button
          onClick={handleGoogleLogin}
          className="bg-white text-emerald-700 font-bold text-lg px-8 py-4 rounded-xl shadow-lg w-full max-w-xs"
        >
          Continue with Google
        </button>
        {authError && <p className="mt-4 text-sm text-amber-100 max-w-xs">{authError}</p>}
      </div>
    );
  }

  const currentDayData = logs[selectedDate] || {};

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center print:bg-white">
      <div className="w-full max-w-md bg-slate-50 min-h-screen relative shadow-2xl print:shadow-none print:max-w-none print:bg-white">

        <div className="print:hidden">
          <Header user={user} />
        </div>

        <main className="w-full">
          {activeTab === 'home' ? (
            <div className="p-4 space-y-4 pb-24 print:hidden animate-fade-in">
              <TimelineCard period="morning" label="Morning" data={currentDayData.morning} onActionClick={setActiveModal} />
              <TimelineCard period="noon" label="Noon" data={currentDayData.noon} onActionClick={setActiveModal} />
              <TimelineCard period="evening" label="Evening" data={currentDayData.evening} onActionClick={setActiveModal} />
            </div>
          ) : (
            <HistoryTab user={user} />
          )}
        </main>

        {activeModal && (
          <EntryModal
            period={activeModal}
            label={activeModal.charAt(0).toUpperCase() + activeModal.slice(1)}
            onClose={() => {
              setActiveModal(null);
              syncWithCloud(user);
            }}
          />
        )}

        <BottomNav />
      </div>
    </div>
  );
}

