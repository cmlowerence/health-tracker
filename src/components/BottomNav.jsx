import { CalendarHeart, FileText } from 'lucide-react';
import useStore from '../store/useStore';

export default function BottomNav() {
  const { activeTab, setActiveTab } = useStore();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 pb-safe z-40 print:hidden">
      <div className="max-w-md mx-auto flex justify-around items-center p-2">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center p-2 w-20 transition-colors ${activeTab === 'home' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <CalendarHeart className={`w-6 h-6 mb-1 ${activeTab === 'home' ? 'fill-emerald-100' : ''}`} />
          <span className="text-[10px] font-bold tracking-wide">Today</span>
        </button>

        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center p-2 w-20 transition-colors ${activeTab === 'history' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <FileText className={`w-6 h-6 mb-1 ${activeTab === 'history' ? 'fill-emerald-100' : ''}`} />
          <span className="text-[10px] font-bold tracking-wide">Logs</span>
        </button>
      </div>
    </div>
  );
}
