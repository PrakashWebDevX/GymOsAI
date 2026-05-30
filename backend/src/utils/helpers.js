import sanitizeHtml from 'sanitize-html';

export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} }).trim();
  }
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  if (input && typeof input === 'object') {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [key, sanitizeInput(value)])
    );
  }
  return input;
};

export const pick = (obj, keys) =>
  keys.reduce((acc, key) => {
    if (obj[key] !== undefined) acc[key] = obj[key];
    return acc;
  }, {});

export const paginate = (query) => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
