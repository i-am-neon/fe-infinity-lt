interface ElectronAPI {
  ipcRenderer: {
    send: (channel: string, data: unknown) => void;
    on: (channel: string, func: (...args: unknown[]) => void) => void;
    invoke: (channel: string, data?: unknown) => Promise<any>;
  };
  app: {
    getVersion: () => Promise<string>;
    getServerStatus: () => Promise<boolean>;
    quit: () => void;
  };
}

interface Window {
  electron: ElectronAPI;
}