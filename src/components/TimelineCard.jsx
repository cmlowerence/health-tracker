import { useState } from 'react';
import { Plus, Droplets, Thermometer, Pencil, History, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';

export default function TimelineCard({ period, label, data, onActionClick }) {
  const [showHistory, setShowHistory] = useState(false);

  if (!data) {
    return (
      <button 
        onClick={() => onActionClick(period)}
        className="w-full bg-white border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-emerald-400 hover:text-emerald-600 active:bg-emerald-50 transition"
      >
        <Plus className="w-8 h-8" />
        <span className="font-semibold text-lg">Add {label} Log</span>
      </button>
    );
  }

  const [hours, minutes] = data.time.split(':');
  const time12h = new Date(0, 0, 0, hours, minutes).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  const isEdited = data.history && data.history.length > 0;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 relative overflow-hidden transition-all">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            {label}
            {isEdited && (
              <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md">
                Edited
              </span>
            )}
          </h3>
          <span className="text-sm font-medium text-slate-500 mt-1 inline-block">Log time: {time12h}</span>
        </div>
        
        <button 
          onClick={() => onActionClick(period)}
          className="p-2 bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition"
        >
          <Pencil className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 bg-red-50 p-3 rounded-xl">
          <Droplets className="w-6 h-6 text-red-500 shrink-0" />
          <div>
            <div className="text-2xl font-black text-slate-800">{data.bloodSugar}</div>
            <div className="text-xs font-semibold text-red-600 uppercase">mg/dL</div>
          </div>
        </div>

        {data.temperature ? (
          <div className="flex items-center gap-3 bg-orange-50 p-3 rounded-xl">
            <Thermometer className="w-6 h-6 text-orange-500 shrink-0" />
            <div>
              <div className="text-2xl font-black text-slate-800">{data.temperature}</div>
              <div className="text-xs font-semibold text-orange-600 uppercase">°F</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center bg-slate-50 p-3 rounded-xl text-slate-400 text-sm font-medium">
            No Temp Logged
          </div>
        )}
      </div>

      {isEdited && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center justify-between w-full text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            <span className="flex items-center gap-2"><History className="w-4 h-4" /> View Edit History</span>
            {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showHistory && (
            <div className="mt-3 space-y-2 bg-slate-50 rounded-xl p-3">
              {data.history.map((oldLog, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs text-slate-600 border-b border-slate-200/60 last:border-0 pb-2 last:pb-0">
                  <div>
                    <span className="font-bold text-slate-400 mr-2">Was:</span>
                    <span className="font-semibold">{oldLog.bloodSugar} mg/dL</span>
                    {oldLog.temperature && <span>, {oldLog.temperature}°F</span>}
                  </div>
                  <div className="text-slate-400 text-right">
                    Overwritten at {format(new Date(data.editedAt || Date.now()), 'h:mm a')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

