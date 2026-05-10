import { useEffect, useState } from 'react';
import useStore from './store/useStore';
import Header from './components/Header';
import TimelineCard from './components/TimelineCard';
import EntryModal from './components/EntryModal';
import { Activity } from 'lucide-react';

export default function App() {
  const { isLoaded, initApp, selectedDate, logs, syncWithCloud } = useStore();
  const [activeModal, setActiveModal] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    initApp();

    if (window.netlifyIdentity) {
      window.netlifyIdentity.init();
      setUser(window.netlifyIdentity.currentUser());

      window.netlifyIdentity.on('login', (userObj) => {
        setUser(userObj);
        window.netlifyIdentity.close();
      });

      window.netlifyIdentity.on('logout', () => setUser(null));
    }
  }, [initApp]);

  // NEW: Auto-Sync when user is logged in or network connects
  useEffect(() => {
    if (user) {
      syncWithCloud(user);

      const handleOnline = () => syncWithCloud(user);
      window.addEventListener('online', handleOnline);
      return () => window.removeEventListener('online', handleOnline);
    }
  }, [user, syncWithCloud]);

  if (!isLoaded) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-400">Loading VitalTrack...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-emerald-600 flex flex-col items-center justify-center p-6 text-white text-center">
        <Activity className="w-20 h-20 mb-6 text-emerald-100" />
        <h1 className="text-4xl font-bold mb-2">VitalTrack</h1>
        <p className="text-emerald-100 mb-10 text-lg">Your personal, offline-first health journal.</p>
        
        <button 
          onClick={() => window.netlifyIdentity.open()}
          className="bg-white text-emerald-700 font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all w-full max-w-xs"
        >
          Sign In to Continue
        </button>
      </div>
    );
  }

  const currentDayData = logs[selectedDate] || {};

  return (
    <div className="min-h-screen bg-slate-50 pb-10 flex justify-center">
      <div className="w-full max-w-md bg-slate-50 min-h-screen relative shadow-2xl">
        <Header user={user} />
        
        <main className="p-4 space-y-4">
          <TimelineCard period="morning" label="Morning" data={currentDayData.morning} onActionClick={setActiveModal} />
          <TimelineCard period="noon" label="Noon" data={currentDayData.noon} onActionClick={setActiveModal} />
          <TimelineCard period="evening" label="Evening" data={currentDayData.evening} onActionClick={setActiveModal} />
        </main>

        {activeModal && (
          <EntryModal 
            period={activeModal} 
            label={activeModal.charAt(0).toUpperCase() + activeModal.slice(1)}
            onClose={() => {
              setActiveModal(null);
              syncWithCloud(user); // Auto-sync right after saving!
            }} 
          />
        )}
      </div>
    </div>
  );
}

