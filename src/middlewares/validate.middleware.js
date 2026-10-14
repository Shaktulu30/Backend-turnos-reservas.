export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      status: "error",
      message: "Datos inválidos",
      errors: result.error.issues.map((e) => ({
        campo: e.path.join("."),
        detalle: e.message,
      })),
    });
  }
  req.body = result.data;
  next();
};