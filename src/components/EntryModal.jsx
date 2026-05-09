import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import useStore from '../store/useStore';

export default function EntryModal({ period, label, onClose }) {
  const { selectedDate, logs, saveLog } = useStore();
  
  // Find existing data if we are editing
  const existingLog = logs[selectedDate]?.[period];

  const [time, setTime] = useState('');
  const [bloodSugar, setBloodSugar] = useState('');
  const [temperature, setTemperature] = useState('');

  // Initialize form when component mounts
  useEffect(() => {
    if (existingLog) {
      setTime(existingLog.time);
      setBloodSugar(existingLog.bloodSugar.toString());
      setTemperature(existingLog.temperature ? existingLog.temperature.toString() : '');
    } else {
      setTime(format(new Date(), 'HH:mm'));
      setBloodSugar('');
      setTemperature('');
    }
  }, [existingLog]);

  const handleSave = () => {
    if (!time || !bloodSugar) return alert('Time and Blood Sugar are required.');
    
    saveLog(selectedDate, period, {
      time,
      bloodSugar: Number(bloodSugar),
      temperature: temperature ? Number(temperature) : null
    });
    onClose();
  };

  const isEditing = !!existingLog;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex flex-col justify-end">
      <div className="bg-white rounded-t-3xl w-full max-w-md mx-auto p-6 animate-slide-up shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            {isEditing ? `Edit ${label}` : `Log ${label}`}
          </h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Time</label>
            <input 
              type="time" 
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full text-lg p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Blood Sugar (mg/dL)</label>
            <input 
              type="number" 
              inputMode="numeric"
              value={bloodSugar}
              onChange={(e) => setBloodSugar(e.target.value)}
              placeholder="e.g. 105"
              className="w-full text-2xl font-bold p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none placeholder:font-normal placeholder:text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Temperature (°F) <span className="font-normal text-slate-400">- Optional</span></label>
            <input 
              type="number" 
              inputMode="decimal"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              placeholder="e.g. 98.6"
              className="w-full text-2xl font-bold p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none placeholder:font-normal placeholder:text-lg"
            />
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold py-4 rounded-xl mt-4 active:scale-[0.98] transition-all"
          >
            {isEditing ? 'Update Entry' : 'Save Entry'}
          </button>
        </div>
        
      </div>
    </div>
  );
}

