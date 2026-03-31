const Joi = require("joi");

exports.validateUpdateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).messages({
      "string.min": "Name should have at least {#limit} characters",
      "string.max": "Name should not exceed {#limit} characters",
    }),
    address: Joi.string().allow("").max(300).messages({
      "string.max": "Address cannot exceed {#limit} characters",
    }),
    dob: Joi.date().iso().messages({
      "date.format":
        "Date of birth must be a valid date in ISO format (YYYY-MM-DD)",
    }),
    email: Joi.string().email().messages({
      "string.email": "Please enter a valid email address",
    }),
    mobile: Joi.number().integer().min(1000000000).max(9999999999).messages({
      "number.base": "Mobile number must be numeric",
      "number.min": "Mobile number must be 10 digits",
      "number.max": "Mobile number must be 10 digits",
    }),
    fcmToken: Joi.string().allow("").messages({
      "string.base": "FCM token must be a string",
    }),
    specifications: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ).messages({
      "array.base": "Specifications must be an array",
      "string.base": "Specifications must be a string or array",
    }),
    categoryId: Joi.string().allow("").messages({
      "string.base": "Category ID must be a string",
    }),
    pricePerHour: Joi.number().allow("").messages({
      "number.base": "Price per hour must be a number",
    }),
    experience: Joi.number().allow("").messages({
      "number.base": "Experience must be a number",
    }),
    bio: Joi.string().allow("").max(500).messages({
      "string.base": "Bio must be a string",
      "string.max": "Bio cannot exceed {#limit} characters",
    }),
  });
  return schema.validate(data, { abortEarly: false });
};
