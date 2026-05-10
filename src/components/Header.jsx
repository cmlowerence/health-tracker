import { ChevronLeft, ChevronRight, Activity, LogOut } from 'lucide-react';
import { format, addDays, subDays, parseISO } from 'date-fns';
import useStore from '../store/useStore';

export default function Header({ user }) {
  const { selectedDate, setSelectedDate, isSyncing } = useStore();
  const currentDate = parseISO(selectedDate);
  const isToday = selectedDate === format(new Date(), 'yyyy-MM-dd');

  const handleLogout = () => {
    if (window.netlifyIdentity) window.netlifyIdentity.logout();
  };

  return (
    <header className="bg-emerald-600 text-white p-4 sticky top-0 z-10 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6" />
          <div>
            <h1 className="text-xl font-bold tracking-wide leading-tight">VitalTrack</h1>
            {user && (
              <p className="text-[10px] text-emerald-200 font-medium tracking-wider uppercase">
                {user.user_metadata?.full_name || 'User'}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className={`text-xs px-2 py-1 rounded-full font-medium shadow-sm transition-colors ${isSyncing ? 'bg-amber-400 text-amber-900 animate-pulse' : 'bg-emerald-500 text-white'}`}>
            {isSyncing ? 'Syncing...' : 'Synced'}
          </span>
          <button onClick={handleLogout} className="p-1.5 bg-emerald-700/50 hover:bg-emerald-700 rounded-lg transition" title="Log Out">
            <LogOut className="w-4 h-4 text-emerald-100" />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center bg-emerald-700/50 rounded-xl p-2 shadow-inner">
        <button onClick={() => setSelectedDate(format(subDays(currentDate, 1), 'yyyy-MM-dd'))} className="p-2 hover:bg-emerald-500 rounded-lg transition">
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex flex-col items-center">
          <span className="font-medium text-lg flex items-center gap-2">
            {format(currentDate, 'EEEE, MMM d')}
            {isToday && <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full shadow-sm">Today</span>}
          </span>
        </div>

        <button onClick={() => setSelectedDate(format(addDays(currentDate, 1), 'yyyy-MM-dd'))} className="p-2 hover:bg-emerald-500 rounded-lg transition">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}

