import { getStore, connectLambda } from "@netlify/blobs";

const getProfileUpdatedAt = (profile) => Number.isFinite(profile?.updatedAt) ? profile.updatedAt : 0;

const mergeProfiles = (cloudProfile = {}, clientProfile = {}) => {
  if (!cloudProfile?.patientName) return clientProfile || {};
  if (!clientProfile?.patientName) return cloudProfile || {};

  return getProfileUpdatedAt(clientProfile) > getProfileUpdatedAt(cloudProfile)
    ? clientProfile
    : cloudProfile;
};

export const handler = async (event, context) => {
  connectLambda(event);

  const { user } = context.clientContext;
  if (!user) {
    return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
  }

  try {
    const clientData = JSON.parse(event.body || "{}");
    const store = getStore("health_logs");
    
    const cloudBlob = await store.get(user.sub, { type: "json" }) || { logs: {}, profile: {} };
    let cloudLogs = cloudBlob.logs || {};
    const cloudProfile = cloudBlob.profile || {};
    let mergedLogs = { ...cloudLogs };

    const clientLogs = clientData.logs || {};
    const clientProfile = clientData.profile || {};
    
    for (const [date, periods] of Object.entries(clientLogs)) {
      if (!mergedLogs[date]) mergedLogs[date] = {};

      for (const [period, clientEntry] of Object.entries(periods)) {
        const cloudEntry = mergedLogs[date][period];

        if (!cloudEntry || clientEntry.timestamp > cloudEntry.timestamp) {
          mergedLogs[date][period] = clientEntry;
        } 
      }
    }

    const mergedProfile = mergeProfiles(cloudProfile, clientProfile);

    await store.setJSON(user.sub, { logs: mergedLogs, profile: mergedProfile, lastSync: Date.now() });

    return {
      statusCode: 200,
      body: JSON.stringify({ logs: mergedLogs, profile: mergedProfile }),
    };

  } catch (error) {
    console.error("Sync Error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Internal Server Error" }) };
  }
};

