const { contextBridge, ipcRenderer } = require('electron');

// Add global electronAPI for Deno processes
if (typeof global !== 'undefined') {
  global.electronAPI = {
    runGame: (projectPath) => ipcRenderer.invoke('runGame', projectPath)
  };
}

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
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    invoke: (channel, data) => {
      const validChannels = ['isServerReady', 'runGame'];
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
  }
});