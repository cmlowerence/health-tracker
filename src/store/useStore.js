import { create } from 'zustand';
import localforage from 'localforage';
import { format } from 'date-fns';

const useStore = create((set, get) => ({
  selectedDate: format(new Date(), 'yyyy-MM-dd'),
  logs: {},
  isLoaded: false,

  initApp: async () => {
    const savedLogs = await localforage.getItem('health_logs') || {};
    set({ logs: savedLogs, isLoaded: true });
  },

  setSelectedDate: (date) => set({ selectedDate: date }),

  saveLog: async (date, period, data) => {
    const { logs } = get();
    const existingLog = logs[date]?.[period];
    const now = Date.now();

    const newEntry = {
      ...data,
      timestamp: existingLog ? existingLog.timestamp : now, 
      editedAt: existingLog ? now : null, 
      deviceId: 'local_device',
      history: existingLog 
        ? [{ ...existingLog, history: undefined }, ...(existingLog.history || [])]
        : []
    };

    const updatedLogs = {
      ...logs,
      [date]: {
        ...(logs[date] || {}),
        [period]: newEntry
      }
    };

    set({ logs: updatedLogs });
    await localforage.setItem('health_logs', updatedLogs);
  }
}));

export default useStore;