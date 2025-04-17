const { contextBridge, ipcRenderer } = require('electron');

// Add global electronAPI for Deno processes
if (typeof global !== 'undefined') {
  global.electronAPI = {
    runGame: (projectPath) => ipcRenderer.invoke('runGame', projectPath)
  };
}

// Log preload script execution to help with debugging
console.log('Preload script executing');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, data) => {
      const validChannels = ['toMain', 'checkServer', 'runGame'];
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
        'exportLogs'
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
  }
});

// Log that preload script is complete
console.log('Preload script completed');