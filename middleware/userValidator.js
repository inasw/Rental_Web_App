
const Joi =require("joi");

const userValidator = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
      .trim()
      .required()
      .error(() => {
        return { message: "Name is required and cannot be empty." };
      }),
    email: Joi.string()
      .trim()
      .email()
      .required()
      .error(() => {
        return { message: "Enter a valid email address." };
      }),
    password: Joi.string()
      .trim()
      .min(8)
      .max(30)
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[^s]{8,}$"))
      .required()
      .error(() => {
        return {
          message:
            "Password must be at least 8 characters & contain a num, lowercase, uppercase letter.",
        };
      }),
    role: Joi.string().valid("renter", "landlord", "admin", "super", "broker"),
  }).options({ stripUnknown: true });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports =userValidator;
