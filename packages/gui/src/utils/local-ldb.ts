const dbFact = () => {
  {
    const win = typeof window !== 'undefined' ? window : undefined;
    if (!win) {
      throw new Error('indexedDB cannot get window');
    }
    const indexedDB =
      win.indexedDB ||
      (win as any).mozIndexedDB ||
      (win as any).webkitIndexedDB ||
      (win as any).msIndexedDB;
    if (typeof window !== 'undefined' && !indexedDB) {
      throw new Error('indexDB not supported');
    }
    let db: IDBDatabase | null;
    const request = indexedDB.open('ldb', 1);
    request.onsuccess = function () {
      db = this.result;
    };
    request.onerror = (event: Event) => {
      console.error('indexedDB request error');
      console.log(event);
    };

    request.onupgradeneeded = function (event: IDBVersionChangeEvent) {
      db = null;
      const store =
        event &&
        event.target &&
        (event.target as any).result.createObjectStore('s', {
          keyPath: 'k',
        });

      store.transaction.oncomplete = function (e: Event) {
        db = (e.target as any).db as IDBDatabase;
      };
    };

    const localDb = {
      get: (key: string) =>
        new Promise<string>((resolve) => {
          if (!db) {
            setTimeout(async () => resolve(await localDb.get(key)), 50);
            return;
          }
          db.transaction('s').objectStore('s').get(key).onsuccess = function (event) {
            const result =
              ((event.target as any).result && (event.target as any).result['v']) || null;
            resolve(result);
          };
        }),
      set: (key: string, value: string) =>
        new Promise<void>((resolve) => {
          if (!db) {
            setTimeout(async () => resolve(await localDb.set(key, value)), 50);
            return;
          }
          let txn = db.transaction('s', 'readwrite');
          txn.oncomplete = () => resolve();
          txn.objectStore('s').put({
            k: key,
            v: value,
          });
          txn.commit();
        }),
      delete: (key: string) =>
        new Promise<void>((resolve) => {
          if (!db) {
            setTimeout(async () => resolve(await localDb.delete(key)), 50);
            return;
          }
          db.transaction('s', 'readwrite').objectStore('s').delete(key).onsuccess = function () {
            resolve();
          };
        }),
      list: () =>
        new Promise<string[]>((resolve) => {
          if (!db) {
            setTimeout(async () => resolve(await localDb.list()), 50);
            return;
          }
          db.transaction('s').objectStore('s').getAllKeys().onsuccess = (event) => {
            const result = (event.target as any).result || null;
            resolve(result);
          };
        }),
      getAll: () =>
        new Promise<Array<{ k: string; v: string }>>((resolve) => {
          if (!db) {
            setTimeout(async () => resolve(await localDb.getAll()), 50);
            return;
          }
          db.transaction('s').objectStore('s').getAll().onsuccess = (event) => {
            const result = ((event.target as any).result as any) || null;
            resolve(result);
          };
        }),
      clear: () =>
        new Promise<void>((resolve) => {
          if (!db) {
            setTimeout(async () => resolve(await localDb.clear()), 50);
            return;
          }
          db.transaction('s', 'readwrite').objectStore('s').clear().onsuccess = () => {
            resolve();
          };
        }),
    };
    return localDb;
  }
};

export const ldb = dbFact();
