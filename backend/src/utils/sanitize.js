import sanitizeHtml from 'sanitize-html';

export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return sanitizeHtml(input, {
      allowedTags: [],
      allowedAttributes: {},
    }).trim();
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

export const sanitizeBody = (req, _res, next) => {
  if (req.body) {
    req.body = sanitizeInput(req.body);
  }
  next();
};
