import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from './env.js';

const genAI = new GoogleGenerativeAI(env.gemini.apiKey);

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const geminiProModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
