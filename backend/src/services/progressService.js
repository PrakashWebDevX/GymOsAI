import { progressRepository } from '../repositories/index.js';
import { generateWeeklyReport } from '../ai/geminiService.js';

export class ProgressService {
  async getProgress(userId) {
    const [logs, photos] = await Promise.all([
      progressRepository.getLogs(userId),
      progressRepository.getPhotos(userId),
    ]);

    return { logs, photos };
  }

  async addLog(userId, logData) {
    return progressRepository.create({
      user_id: userId,
      ...logData,
      logged_at: new Date().toISOString(),
    });
  }

  async addPhoto(userId, photoData) {
    return progressRepository.addPhoto(userId, {
      ...photoData,
      taken_at: new Date().toISOString(),
    });
  }

  async getWeeklyReport(userId) {
    const logs = await progressRepository.getLogs(userId, 7);
    return generateWeeklyReport({ progress: logs });
  }
}

export const progressService = new ProgressService();
