/**
 * FIRESTORE QUOTA MONITORING AND OPTIMIZATION
 * 
 * This utility helps monitor and optimize Firestore usage to prevent
 * "resource-exhausted" quota exceeded errors.
 * 
 * CURRENT QUOTA LIMITS (Spark Plan - Free):
 * - Document reads: 50,000 per day
 * - Document writes: 20,000 per day
 * - Document deletes: 20,000 per day
 */

interface OperationCount {
  reads: number;
  writes: number;
  deletes: number;
  errors: number;
  lastReset: Date;
}

class FirestoreMonitor {
  private operations: OperationCount = {
    reads: 0,
    writes: 0,
    deletes: 0,
    errors: 0,
    lastReset: new Date()
  };

  private readonly MAX_READS_PER_DAY = 50000;
  private readonly MAX_WRITES_PER_DAY = 20000;
  private readonly MAX_DELETES_PER_DAY = 20000;

  /**
   * Track a read operation
   */
  trackRead(operation: string, collection?: string) {
    this.operations.reads++;
    this.logOperation('READ', operation, collection);
    this.checkThresholds();
  }

  /**
   * Track a write operation
   */
  trackWrite(operation: string, collection?: string) {
    this.operations.writes++;
    this.logOperation('WRITE', operation, collection);
    this.checkThresholds();
  }

  /**
   * Track a delete operation
   */
  trackDelete(operation: string, collection?: string) {
    this.operations.deletes++;
    this.logOperation('DELETE', operation, collection);
    this.checkThresholds();
  }

  /**
   * Track an error (especially quota-related)
   */
  trackError(error: any, operation: string) {
    this.operations.errors++;
    
    if (error.code === 'resource-exhausted') {
      console.error('🚨 QUOTA EXCEEDED ERROR:', {
        operation,
        currentUsage: this.getUsageStats(),
        error: error.message
      });
      
      this.suggestOptimizations();
    }
  }

  /**
   * Log operation with color coding
   */
  private logOperation(type: string, operation: string, collection?: string) {
    const emoji = type === 'READ' ? '👁️' : type === 'WRITE' ? '✍️' : '🗑️';
    const count = type === 'READ' ? this.operations.reads : 
                  type === 'WRITE' ? this.operations.writes : this.operations.deletes;
    
    console.log(`${emoji} ${type} #${count}: ${operation}${collection ? ` (${collection})` : ''}`);
  }

  /**
   * Check if approaching quota limits
   */
  private checkThresholds() {
    const { reads, writes, deletes } = this.operations;
    
    // Warning at 80% of quota
    if (reads > this.MAX_READS_PER_DAY * 0.8) {
      console.warn(`⚠️ READS WARNING: ${reads}/${this.MAX_READS_PER_DAY} (${(reads/this.MAX_READS_PER_DAY*100).toFixed(1)}%)`);
    }
    
    if (writes > this.MAX_WRITES_PER_DAY * 0.8) {
      console.warn(`⚠️ WRITES WARNING: ${writes}/${this.MAX_WRITES_PER_DAY} (${(writes/this.MAX_WRITES_PER_DAY*100).toFixed(1)}%)`);
    }
    
    if (deletes > this.MAX_DELETES_PER_DAY * 0.8) {
      console.warn(`⚠️ DELETES WARNING: ${deletes}/${this.MAX_DELETES_PER_DAY} (${(deletes/this.MAX_DELETES_PER_DAY*100).toFixed(1)}%)`);
    }
  }

  /**
   * Get current usage statistics
   */
  getUsageStats() {
    const { reads, writes, deletes, errors } = this.operations;
    
    return {
      reads: {
        count: reads,
        percentage: (reads / this.MAX_READS_PER_DAY * 100).toFixed(2),
        remaining: this.MAX_READS_PER_DAY - reads
      },
      writes: {
        count: writes,
        percentage: (writes / this.MAX_WRITES_PER_DAY * 100).toFixed(2),
        remaining: this.MAX_WRITES_PER_DAY - writes
      },
      deletes: {
        count: deletes,
        percentage: (deletes / this.MAX_DELETES_PER_DAY * 100).toFixed(2),
        remaining: this.MAX_DELETES_PER_DAY - deletes
      },
      errors,
      lastReset: this.operations.lastReset
    };
  }

  /**
   * Display current usage in console
   */
  logStats() {
    const stats = this.getUsageStats();
    
    console.log('📊 Firestore Usage Statistics:');
    console.log(`👁️ Reads: ${stats.reads.count} (${stats.reads.percentage}%) - ${stats.reads.remaining} remaining`);
    console.log(`✍️ Writes: ${stats.writes.count} (${stats.writes.percentage}%) - ${stats.writes.remaining} remaining`);
    console.log(`🗑️ Deletes: ${stats.deletes.count} (${stats.deletes.percentage}%) - ${stats.deletes.remaining} remaining`);
    console.log(`❌ Errors: ${stats.errors}`);
    console.log(`🕐 Session started: ${stats.lastReset.toLocaleString()}`);
  }

  /**
   * Suggest optimizations when quota is high
   */
  private suggestOptimizations() {
    console.log('💡 QUOTA OPTIMIZATION SUGGESTIONS:');
    console.log('   1. ✅ Use single onSnapshot listeners (already implemented)');
    console.log('   2. ✅ Implement proper cleanup with useRef (already implemented)');
    console.log('   3. ✅ Conditional writes (only when data changes)');
    console.log('   4. 🔄 Consider batching multiple writes into single operations');
    console.log('   5. ⏰ Implement debouncing for frequent operations');
    console.log('   6. 💳 Upgrade to Firebase Blaze plan for higher quotas');
    console.log('   7. 🏃‍♂️ Add exponential backoff retry logic');
  }

  /**
   * Reset counters (call daily or when needed)
   */
  reset() {
    this.operations = {
      reads: 0,
      writes: 0,
      deletes: 0,
      errors: 0,
      lastReset: new Date()
    };
    console.log('🔄 Firestore operation counters reset');
  }
}

// Export singleton instance
export const firestoreMonitor = new FirestoreMonitor();

/**
 * OPTIMIZATION PATTERNS FOR COMMON OPERATIONS
 */

/**
 * Optimized batch write function
 * Use this instead of multiple individual writes
 */
export async function batchWrite(operations: Array<{
  ref: any;
  data: any;
  type: 'set' | 'update' | 'delete';
}>) {
  const { writeBatch } = await import('firebase/firestore');
  const { db } = await import('@/lib/firebase');
  
  try {
    console.log(`📦 Starting batch write with ${operations.length} operations`);
    
    const batch = writeBatch(db);
    
    operations.forEach(({ ref, data, type }) => {
      switch (type) {
        case 'set':
          batch.set(ref, data);
          break;
        case 'update':
          batch.update(ref, data);
          break;
        case 'delete':
          batch.delete(ref);
          break;
      }
    });
    
    await batch.commit();
    
    // Count as single write operation
    firestoreMonitor.trackWrite(`Batch write (${operations.length} operations)`);
    
    console.log(`✅ Batch write completed successfully`);
  } catch (error) {
    firestoreMonitor.trackError(error, 'batchWrite');
    throw error;
  }
}

/**
 * Debounced write function
 * Prevents excessive writes from rapid state changes
 */
export function createDebouncedWrite(delay: number = 500) {
  let timeoutId: NodeJS.Timeout;
  
  return function debouncedWrite(writeFunction: () => Promise<void>) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(async () => {
      try {
        await writeFunction();
        firestoreMonitor.trackWrite('Debounced write');
      } catch (error) {
        firestoreMonitor.trackError(error, 'debouncedWrite');
        throw error;
      }
    }, delay);
  };
}

/**
 * Exponential backoff retry wrapper
 * Use for operations that might fail due to quota limits
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      if (error.code === 'resource-exhausted' && attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`⏳ Quota exceeded, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      firestoreMonitor.trackError(error, `retryWithBackoff (attempt ${attempt + 1})`);
      throw error;
    }
  }
  
  throw lastError;
}

/**
 * Usage Examples:
 * 
 * // Monitor operations:
 * firestoreMonitor.trackRead('Profile data fetch', 'profile');
 * firestoreMonitor.trackWrite('Profile image update', 'profile');
 * 
 * // Check usage:
 * firestoreMonitor.logStats();
 * 
 * // Batch writes:
 * await batchWrite([
 *   { ref: doc(db, 'profile', 'main'), data: { image: 'url' }, type: 'set' },
 *   { ref: doc(db, 'settings', 'config'), data: { updated: new Date() }, type: 'update' }
 * ]);
 * 
 * // Debounced writes:
 * const debouncedWrite = createDebouncedWrite(1000);
 * debouncedWrite(() => setDoc(doc(db, 'profile', 'main'), data));
 * 
 * // Retry with backoff:
 * await retryWithBackoff(() => setDoc(doc(db, 'profile', 'main'), data));
 */

// Auto-reset counters daily (optional)
if (typeof window !== 'undefined') {
  // Reset at midnight
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const timeUntilMidnight = tomorrow.getTime() - now.getTime();
  
  setTimeout(() => {
    firestoreMonitor.reset();
    // Set daily reset interval
    setInterval(() => firestoreMonitor.reset(), 24 * 60 * 60 * 1000);
  }, timeUntilMidnight);
}
