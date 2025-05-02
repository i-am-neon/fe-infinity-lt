import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Opens a URL in the user's default browser.
 * In Electron, uses the shell.openExternal API.
 * In a browser, opens a new tab.
 */
export function openExternalLink(url: string) {
  if (window.electron) {
    window.electron.ipcRenderer.send('openExternal', url);
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
