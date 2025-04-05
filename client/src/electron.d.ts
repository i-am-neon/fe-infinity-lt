interface ElectronAPI {
  ipcRenderer: {
    send: (channel: string, data: unknown) => void;
    on: (channel: string, func: (...args: unknown[]) => void) => void;
    invoke: (channel: string, data?: unknown) => Promise<unknown>;
  };
  app: {
    getVersion: () => Promise<string>;
    getServerStatus: () => Promise<boolean>;
    quit: () => void;
  };
  apiKeys: {
    get: () => Promise<string | null>;
    set: (key: string) => Promise<boolean>;
    delete: () => Promise<boolean>;
    has: () => Promise<boolean>;
  };
  test: {
    ping: () => string;
  };
}

interface Window {
  electron: ElectronAPI;
}