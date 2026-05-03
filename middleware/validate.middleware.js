import AppError from "../utils/errors.js";

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((err) => ({
      field: err.path[0],
      message: err.message,
    }));

    return next(new AppError(JSON.stringify(errors), 400));
  }

  req.validatedData = result.data;
  next();
};

export default validate;