// Firestore Usage Monitor
// Add this to monitor and debug database operations

let writeCount = 0;
let readCount = 0;
let deleteCount = 0;

const resetCounters = () => {
  writeCount = 0;
  readCount = 0;
  deleteCount = 0;
  console.log('🔄 Firestore operation counters reset');
};

export const firestoreMonitor = {
  trackWrite: (operation: string) => {
    writeCount++;
    console.log(`✍️ Write #${writeCount}: ${operation}`);
    if (writeCount > 50) {
      console.warn(`⚠️ High write count detected: ${writeCount} writes`);
    }
  },
  
  trackRead: (operation: string) => {
    readCount++;
    console.log(`👁️ Read #${readCount}: ${operation}`);
    if (readCount > 100) {
      console.warn(`⚠️ High read count detected: ${readCount} reads`);
    }
  },
  
  trackDelete: (operation: string) => {
    deleteCount++;
    console.log(`🗑️ Delete #${deleteCount}: ${operation}`);
  },
  
  getStats: () => ({
    writes: writeCount,
    reads: readCount,
    deletes: deleteCount,
    total: writeCount + readCount + deleteCount
  }),
  
  logStats: () => {
    const stats = firestoreMonitor.getStats();
    console.log('📊 Firestore Operations Summary:', {
      '✍️ Writes': stats.writes,
      '👁️ Reads': stats.reads, 
      '🗑️ Deletes': stats.deletes,
      '📈 Total': stats.total
    });
  },
  
  reset: resetCounters
};

// Reset counters every hour to track session usage
if (typeof window !== 'undefined') {
  setInterval(resetCounters, 3600000); // 1 hour
}

// Usage example:
// import { firestoreMonitor } from './firestoreMonitor';
// 
// // Before any setDoc call:
// firestoreMonitor.trackWrite('Profile image update');
// await setDoc(docRef, data);
//
// // Check stats:
// firestoreMonitor.logStats();
