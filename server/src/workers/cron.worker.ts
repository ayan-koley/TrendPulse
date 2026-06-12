import cron from 'node-cron';
import { runTrendIngestionJob } from './trendIngestion.worker.ts';

/**
 * Automated Cron Routine Orchestration Bootstrap Interface
 */
export function initCronWorkers(): void {
  // Schedule to execute target job clean run exactly once every hour
  cron.schedule('*/5 * * * *', () => {
    runTrendIngestionJob();
  });
  
  console.log('🚀 Chronometer registry system active and listening...');
}