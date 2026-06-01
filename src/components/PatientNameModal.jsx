import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import useStore from '../store/useStore';

export default function PatientNameModal({ onClose }) {
  const { patientName, setPatientName } = useStore();
  const [name, setName] = useState(patientName);
  const [error, setError] = useState('');

  useEffect(() => {
    setName(patientName);
  }, [patientName]);

  const handleSave = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Patient name is required.');
      return;
    }

    await setPatientName(trimmedName);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex flex-col justify-end">
      <div className="bg-white rounded-t-3xl w-full max-w-md mx-auto p-6 animate-slide-up shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Edit Patient Name</h2>
            <p className="text-sm text-slate-500 mt-1">This name appears in the header and printed reports.</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition" title="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1" htmlFor="patient-name">
              Patient Name
            </label>
            <input
              id="patient-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter patient name"
              className={`w-full text-lg p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none ${
                error ? 'border-red-300 focus:ring-red-400' : 'border-slate-200'
              }`}
              autoFocus
            />
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-lg font-bold py-4 rounded-xl active:scale-[0.98] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold py-4 rounded-xl active:scale-[0.98] transition-all"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
