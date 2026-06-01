import { create } from 'zustand';
import localforage from 'localforage';
import { format } from 'date-fns';

const PATIENT_PROFILE_KEY = 'patient_profile';
const DEFAULT_PROFILE = { patientName: 'User', updatedAt: 0 };

const getDefaultPatientName = (user) => user?.user_metadata?.full_name?.trim() || 'User';

const normalizeProfile = (profile, fallbackPatientName = DEFAULT_PROFILE.patientName) => {
  const patientName = profile?.patientName?.trim() || fallbackPatientName;
  const updatedAt = Number.isFinite(profile?.updatedAt) ? profile.updatedAt : 0;

  return { patientName, updatedAt };
};

const useStore = create((set, get) => ({
  selectedDate: format(new Date(), 'yyyy-MM-dd'),
  logs: {},
  profile: DEFAULT_PROFILE,
  patientName: DEFAULT_PROFILE.patientName,
  isLoaded: false,
  isSyncing: false,
  activeTab: 'home', 
  setActiveTab: (tab) => set({ activeTab: tab }),

  initApp: async () => {
    const savedLogs = await localforage.getItem('health_logs') || {};
    const savedProfile = normalizeProfile(await localforage.getItem(PATIENT_PROFILE_KEY), get().patientName);
    set({ logs: savedLogs, profile: savedProfile, patientName: savedProfile.patientName, isLoaded: true });
  },

  initProfile: async (user) => {
    const savedProfile = normalizeProfile(
      await localforage.getItem(PATIENT_PROFILE_KEY),
      getDefaultPatientName(user)
    );
    set({ profile: savedProfile, patientName: savedProfile.patientName });
  },

  setPatientName: async (name) => {
    const patientName = name.trim();
    if (!patientName) return false;

    const profile = { patientName, updatedAt: Date.now() };

    set({ profile, patientName });
    await localforage.setItem(PATIENT_PROFILE_KEY, profile);
    return true;
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
  },

  syncWithCloud: async (user) => {
    if (!user || !navigator.onLine) return;
    
    set({ isSyncing: true });
    try {
      const { logs, profile } = get();
      const token = await user.jwt(true);

      const response = await fetch('/.netlify/functions/sync', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ logs, profile })
      });

      if (!response.ok) throw new Error('Sync failed');

      const masterData = await response.json();
      const syncedProfile = normalizeProfile(masterData.profile, profile.patientName);

      set({
        logs: masterData.logs,
        profile: syncedProfile,
        patientName: syncedProfile.patientName
      });
      await localforage.setItem('health_logs', masterData.logs);
      await localforage.setItem(PATIENT_PROFILE_KEY, syncedProfile);

    } catch (error) {
      console.error("Sync error:", error);
    } finally {
      set({ isSyncing: false });
    }
  }
}));

export default useStore;
