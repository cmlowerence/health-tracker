import { useState } from 'react';
import { Printer, LayoutList, TableProperties } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import useStore from '../store/useStore';

export default function HistoryTab({ user }) {
  const { logs } = useStore();
  const [viewMode, setViewMode] = useState('cards');

  // Sort dates newest first
  const sortedDates = Object.keys(logs).sort((a, b) => new Date(b) - new Date(a));

  const handlePrint = () => {
    setViewMode('table'); 
    setTimeout(() => window.print(), 300);
  };

  const getLogDisplay = (dayData, period) => {
    const data = dayData?.[period];
    if (!data) return <span className="text-slate-300">-</span>;
    return (
      <div className="text-xs">
        <div className="font-bold text-slate-700">{data.bloodSugar} <span className="text-[9px] text-slate-400 font-normal">mg/dL</span></div>
        {data.temperature && <div className="text-slate-500">{data.temperature}°F</div>}
      </div>
    );
  };

  return (
    <div className="p-4 print:p-0 print:bg-white animate-fade-in pb-24">
      
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-6 print:hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">Your Data Logs</h2>
          <button onClick={handlePrint} className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg font-semibold text-sm hover:bg-emerald-200 active:scale-95 transition-all">
            <Printer className="w-4 h-4" /> Export / PDF
          </button>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button onClick={() => setViewMode('cards')} className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'cards' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
            <LayoutList className="w-4 h-4" /> Card View
          </button>
          <button onClick={() => setViewMode('table')} className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'table' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
            <TableProperties className="w-4 h-4" /> Report Table
          </button>
        </div>
      </div>

      <div className="hidden print:block mb-6 border-b-2 border-emerald-600 pb-4">
        <h1 className="text-2xl font-black text-slate-800">VitalTrack Medical Report</h1>
        <p className="text-sm text-slate-500">Patient: {user?.user_metadata?.full_name || 'User'} | Generated: {format(new Date(), 'MMM d, yyyy')}</p>
      </div>

      {sortedDates.length === 0 ? (
        <div className="text-center text-slate-400 mt-10 print:hidden">No data logged yet.</div>
      ) : (
        <>
          {viewMode === 'cards' && (
            <div className="space-y-4 print:hidden">
              {sortedDates.map((date) => {
                const dayData = logs[date];
                return (
                  <div key={date} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-3 pb-2 border-b border-slate-50 flex justify-between">
                      {format(parseISO(date), 'EEEE, MMM d, yyyy')}
                    </h3>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Morning</div>
                        {getLogDisplay(dayData, 'morning')}
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Noon</div>
                        {getLogDisplay(dayData, 'noon')}
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Evening</div>
                        {getLogDisplay(dayData, 'evening')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {viewMode === 'table' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:border-none print:shadow-none print:bg-transparent">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600 print:text-black">
                  <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-bold print:bg-emerald-50 print:text-emerald-900">
                    <tr>
                      <th className="px-4 py-3 border-b print:border-slate-800">Date</th>
                      <th className="px-4 py-3 border-b print:border-slate-800 border-l border-slate-200 bg-slate-50 print:bg-transparent">Morning</th>
                      <th className="px-4 py-3 border-b print:border-slate-800 border-l border-slate-200">Noon</th>
                      <th className="px-4 py-3 border-b print:border-slate-800 border-l border-slate-200 bg-slate-50 print:bg-transparent">Evening</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedDates.map((date) => {
                      const dayData = logs[date];
                      return (
                        <tr key={date} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 print:border-slate-400">
                          <td className="px-4 py-3 font-medium whitespace-nowrap">
                            {format(parseISO(date), 'MMM d, yy')}
                          </td>
                          <td className="px-4 py-3 border-l border-slate-100 bg-slate-50/50 print:bg-transparent">
                            {getLogDisplay(dayData, 'morning')}
                          </td>
                          <td className="px-4 py-3 border-l border-slate-100">
                            {getLogDisplay(dayData, 'noon')}
                          </td>
                          <td className="px-4 py-3 border-l border-slate-100 bg-slate-50/50 print:bg-transparent">
                            {getLogDisplay(dayData, 'evening')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

