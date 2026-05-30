import { ValidationError } from '../utils/errors.js';
import { sanitizeInput } from '../utils/helpers.js';

export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(
    {
      body: sanitizeInput(req.body),
      query: sanitizeInput(req.query),
      params: sanitizeInput(req.params),
    },
    { abortEarly: false, stripUnknown: true }
  );

  if (error) {
    const message = error.details.map((d) => d.message).join(', ');
    return next(new ValidationError(message));
  }

  req.body = value.body ?? req.body;
  req.query = value.query ?? req.query;
  req.params = value.params ?? req.params;
  next();
};
