import { getStore } from "@netlify/blobs";

export const handler = async (event, context) => {
  // 1. Verify User is Logged In
  const { user } = context.clientContext;
  if (!user) {
    return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
  }

  try {
    const clientData = JSON.parse(event.body || "{}");
    const store = getStore("health_logs");
    
    const cloudBlob = await store.get(user.sub, { type: "json" }) || { logs: {} };
    let cloudLogs = cloudBlob.logs || {};
    let mergedLogs = { ...cloudLogs };

    const clientLogs = clientData.logs || {};
    
    for (const [date, periods] of Object.entries(clientLogs)) {
      if (!mergedLogs[date]) mergedLogs[date] = {};

      for (const [period, clientEntry] of Object.entries(periods)) {
        const cloudEntry = mergedLogs[date][period];

        if (!cloudEntry || clientEntry.timestamp > cloudEntry.timestamp) {
          mergedLogs[date][period] = clientEntry;
        } 
      }
    }

    await store.setJSON(user.sub, { logs: mergedLogs, lastSync: Date.now() });

    return {
      statusCode: 200,
      body: JSON.stringify({ logs: mergedLogs }),
    };

  } catch (error) {
    console.error("Sync Error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Internal Server Error" }) };
  }
};

