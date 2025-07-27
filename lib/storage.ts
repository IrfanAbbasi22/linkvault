import { Bookmark } from './types';

// Storage interface for different storage methods
interface StorageProvider {
  save(bookmarks: Bookmark[]): Promise<void>;
  load(): Promise<Bookmark[]>;
  clear(): Promise<void>;
}

// localStorage implementation
class LocalStorageProvider implements StorageProvider {
  private key = 'linkvault-bookmarks';

  async save(bookmarks: Bookmark[]): Promise<void> {
    try {
      const bookmarksForStorage = bookmarks.map(bookmark => ({
        ...bookmark,
        createdAt: bookmark.createdAt.toISOString(),
        updatedAt: bookmark.updatedAt.toISOString(),
      }));
      localStorage.setItem(this.key, JSON.stringify(bookmarksForStorage));
      console.log('Saved to localStorage:', bookmarks.length, 'bookmarks');
    } catch (error) {
      console.error('localStorage save error:', error);
      throw error;
    }
  }

  async load(): Promise<Bookmark[]> {
    try {
      const saved = localStorage.getItem(this.key);
      if (!saved) return [];
      
      const parsed = JSON.parse(saved).map((bookmark: any) => ({
        ...bookmark,
        createdAt: new Date(bookmark.createdAt),
        updatedAt: new Date(bookmark.updatedAt),
      }));
      console.log('Loaded from localStorage:', parsed.length, 'bookmarks');
      return parsed;
    } catch (error) {
      console.error('localStorage load error:', error);
      return [];
    }
  }

  async clear(): Promise<void> {
    localStorage.removeItem(this.key);
  }
}

// IndexedDB implementation for larger storage
class IndexedDBProvider implements StorageProvider {
  private dbName = 'LinkVaultDB';
  private storeName = 'bookmarks';
  private version = 1;

  private async getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  async save(bookmarks: Bookmark[]): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      // Clear existing data
      await new Promise<void>((resolve, reject) => {
        const clearRequest = store.clear();
        clearRequest.onsuccess = () => resolve();
        clearRequest.onerror = () => reject(clearRequest.error);
      });
      
      // Add new data
      for (const bookmark of bookmarks) {
        const bookmarkForStorage = {
          ...bookmark,
          createdAt: bookmark.createdAt.toISOString(),
          updatedAt: bookmark.updatedAt.toISOString(),
        };
        store.add(bookmarkForStorage);
      }
      
      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
      
      console.log('Saved to IndexedDB:', bookmarks.length, 'bookmarks');
    } catch (error) {
      console.error('IndexedDB save error:', error);
      throw error;
    }
  }

  async load(): Promise<Bookmark[]> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => {
          const bookmarks = request.result.map((bookmark: any) => ({
            ...bookmark,
            createdAt: new Date(bookmark.createdAt),
            updatedAt: new Date(bookmark.updatedAt),
          }));
          console.log('Loaded from IndexedDB:', bookmarks.length, 'bookmarks');
          resolve(bookmarks);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('IndexedDB load error:', error);
      return [];
    }
  }

  async clear(): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      store.clear();
    } catch (error) {
      console.error('IndexedDB clear error:', error);
    }
  }
}

// Export/Import functionality
export class ExportImportManager {
  static exportToJSON(bookmarks: Bookmark[]): string {
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      bookmarks: bookmarks.map(bookmark => ({
        ...bookmark,
        createdAt: bookmark.createdAt.toISOString(),
        updatedAt: bookmark.updatedAt.toISOString(),
      }))
    };
    return JSON.stringify(exportData, null, 2);
  }

  static importFromJSON(jsonString: string): Bookmark[] {
    try {
      const importData = JSON.parse(jsonString);
      if (!importData.bookmarks || !Array.isArray(importData.bookmarks)) {
        throw new Error('Invalid export format');
      }
      
      return importData.bookmarks.map((bookmark: any) => ({
        ...bookmark,
        createdAt: new Date(bookmark.createdAt),
        updatedAt: new Date(bookmark.updatedAt),
      }));
    } catch (error) {
      console.error('Import error:', error);
      throw new Error('Failed to import bookmarks');
    }
  }

  static downloadBackup(bookmarks: Bookmark[]): void {
    const data = this.exportToJSON(bookmarks);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkvault-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Main storage manager with fallback
export class StorageManager {
  private providers: StorageProvider[] = [];
  private currentProvider: StorageProvider;

  constructor() {
    // Try IndexedDB first, fallback to localStorage
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      this.providers.push(new IndexedDBProvider());
    }
    this.providers.push(new LocalStorageProvider());
    this.currentProvider = this.providers[0];
  }

  async save(bookmarks: Bookmark[]): Promise<void> {
    for (const provider of this.providers) {
      try {
        await provider.save(bookmarks);
        this.currentProvider = provider;
        return;
      } catch (error) {
        console.warn(`Failed to save with provider:`, error);
        continue;
      }
    }
    throw new Error('All storage providers failed');
  }

  async load(): Promise<Bookmark[]> {
    for (const provider of this.providers) {
      try {
        const bookmarks = await provider.load();
        if (bookmarks.length > 0) {
          this.currentProvider = provider;
          return bookmarks;
        }
      } catch (error) {
        console.warn(`Failed to load with provider:`, error);
        continue;
      }
    }
    return [];
  }

  async clear(): Promise<void> {
    for (const provider of this.providers) {
      try {
        await provider.clear();
      } catch (error) {
        console.warn(`Failed to clear with provider:`, error);
      }
    }
  }

  getCurrentProviderName(): string {
    return this.currentProvider.constructor.name;
  }
}

// Create singleton instance
export const storageManager = new StorageManager(); 