const { contextBridge, ipcRenderer } = require('electron');

// Define all APIs first before exposing them
const electronAPI = {
  ipcRenderer: {
    send: (channel, data) => {
      const validChannels = ['toMain', 'checkServer', 'runGame', 'openExternal'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    on: (channel, func) => {
      const validChannels = ['fromMain', 'serverStatus', 'gameRunStatus'];
      if (validChannels.includes(channel)) {
        // Remove the previous listener if there is one
        ipcRenderer.removeAllListeners(channel);
        // Add the new listener
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    invoke: (channel, data) => {
      const validChannels = [
        'isServerReady',
        'runGame',
        'api-call',
        'getApiKey',
        'setApiKey',
        'deleteApiKey',
        'hasApiKey',
        'exportLogs',
        // Add user assets channels
        'user-assets:get-path',
        'user-assets:has-asset'
      ];
      if (validChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, data);
      }
      return Promise.reject(new Error(`Invalid channel: ${channel}`));
    }
  },
  app: {
    getVersion: () => ipcRenderer.invoke('getAppVersion'),
    getServerStatus: () => ipcRenderer.invoke('getServerStatus'),
    quit: () => ipcRenderer.send('quitApp')
  },
  // Add a simple test method to verify IPC is working
  test: {
    ping: () => 'pong'
  },
  // Add API key management
  apiKeys: {
    get: () => ipcRenderer.invoke('getApiKey'),
    set: (key) => ipcRenderer.invoke('setApiKey', { key }),
    delete: () => ipcRenderer.invoke('deleteApiKey'),
    has: () => ipcRenderer.invoke('hasApiKey')
  },
  // Add user assets API - ensure we properly await the promises
  userAssets: {
    getUserAssetPath: async (assetPath) => {
      try {
        // Important: await the promise to get the actual string value
        return await ipcRenderer.invoke('user-assets:get-path', assetPath);
      } catch (error) {
        console.error(`Error getting path for ${assetPath}:`, error);
        throw error;
      }
    },
    hasUserAsset: async (assetPath) => {
      try {
        // Important: await the promise to get the actual boolean value
        return await ipcRenderer.invoke('user-assets:has-asset', assetPath);
      } catch (error) {
        console.error(`Error checking if asset exists for ${assetPath}:`, error);
        return false;
      }
    }
  }
};

// Expose the API to the renderer
contextBridge.exposeInMainWorld('electron', electronAPI);