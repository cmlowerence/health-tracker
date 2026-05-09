import { ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { format, addDays, subDays, parseISO } from 'date-fns';
import useStore from '../store/useStore';

export default function Header() {
  const { selectedDate, setSelectedDate } = useStore();
  const currentDate = parseISO(selectedDate);
  
  const isToday = selectedDate === format(new Date(), 'yyyy-MM-dd');

  return (
    <header className="bg-emerald-600 text-white p-4 sticky top-0 z-10 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6" />
          <h1 className="text-xl font-bold tracking-wide">VitalTrack</h1>
        </div>
        <span className="text-xs bg-emerald-500 px-2 py-1 rounded-full font-medium">Offline</span>
      </div>

      <div className="flex justify-between items-center bg-emerald-700/50 rounded-xl p-2">
        <button 
          onClick={() => setSelectedDate(format(subDays(currentDate, 1), 'yyyy-MM-dd'))}
          className="p-2 hover:bg-emerald-500 rounded-lg transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex flex-col items-center">
          <span className="font-medium text-lg flex items-center gap-2">
            {format(currentDate, 'EEEE, MMM d')}
            {isToday && (
              <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                Today
              </span>
            )}
          </span>
        </div>

        <button 
          onClick={() => setSelectedDate(format(addDays(currentDate, 1), 'yyyy-MM-dd'))}
          className="p-2 hover:bg-emerald-500 rounded-lg transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}