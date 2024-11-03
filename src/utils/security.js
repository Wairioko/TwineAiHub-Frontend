import { AES, enc } from 'crypto-js';

const ENCRYPTION_KEY = process.env.REACT_APP_STORAGE_ENCRYPTION_KEY;

export const secureStorage = {
  set: (key, data) => {
    try {
      const encrypted = AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Storage encryption failed:', error);
    }
  },

  get: (key) => {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      const decrypted = AES.decrypt(encrypted, ENCRYPTION_KEY).toString(enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Storage decryption failed:', error);
      return null;
    }
  },

  remove: (key) => {
    localStorage.removeItem(key);
  }
};
