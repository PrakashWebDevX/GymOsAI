export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'Access denied',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation failed',
  INTERNAL_ERROR: 'Internal server error',
  RATE_LIMIT: 'Too many requests, please try again later',
};

export const FITNESS_GOALS = ['weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'general_fitness'];
export const ACTIVITY_LEVELS = ['sedentary', 'light', 'moderate', 'active', 'very_active'];
export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];
export const WORKOUT_TYPES = ['strength', 'cardio', 'hiit', 'flexibility', 'mixed'];
export const ACHIEVEMENT_TYPES = ['streak', 'milestone', 'challenge', 'personal_best'];
