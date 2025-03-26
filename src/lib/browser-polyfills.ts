
/**
 * Browser-compatible polyfills for Node.js built-in modules
 */

// Polyfill for util.promisify
export const promisify = <T>(fn: Function): ((...args: any[]) => Promise<T>) => {
  return (...args: any[]): Promise<T> => {
    return new Promise((resolve, reject) => {
      fn(...args, (err: Error | null, result: T) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };
};

// Add other browser polyfills as needed
