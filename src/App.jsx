import { useEffect, useState } from 'react';
import useStore from './store/useStore';
import Header from './components/Header';
import TimelineCard from './components/TimelineCard';
import EntryModal from './components/EntryModal';

export default function App() {
  const { isLoaded, initApp, selectedDate, logs } = useStore();
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    initApp();
  }, [initApp]);

  if (!isLoaded) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-400">Loading VitalTrack...</div>;

  const currentDayData = logs[selectedDate] || {};

  return (
    <div className="min-h-screen bg-slate-50 pb-10 flex justify-center">
      <div className="w-full max-w-md bg-slate-50 min-h-screen relative shadow-2xl">
        
        <Header />

        <main className="p-4 space-y-4">
          <TimelineCard 
            period="morning" 
            label="Morning" 
            data={currentDayData.morning} 
            onActionClick={setActiveModal} 
          />
          <TimelineCard 
            period="noon" 
            label="Noon" 
            data={currentDayData.noon} 
            onActionClick={setActiveModal} 
          />
          <TimelineCard 
            period="evening" 
            label="Evening" 
            data={currentDayData.evening} 
            onActionClick={setActiveModal} 
          />
        </main>

        {activeModal && (
          <EntryModal 
            period={activeModal} 
            label={activeModal.charAt(0).toUpperCase() + activeModal.slice(1)}
            onClose={() => setActiveModal(null)} 
          />
        )}
        
      </div>
    </div>
  );
}

