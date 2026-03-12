const Joi = require("joi");

/**
 * Validation schemas for the Recycle Marketplace API
 */

const signupSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().allow("", null).optional(),
  role: Joi.string().valid("seller", "collector").required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const createListingSchema = Joi.object({
  material_id: Joi.number().integer().required(),
  quantity: Joi.number().positive().required(),
  unit: Joi.string().default("kg"),
  notes: Joi.string().allow("", null).optional(),
  pickup_address: Joi.string().allow("", null).optional(),
});

const updateListingSchema = Joi.object({
  quantity: Joi.number().positive().optional(),
  notes: Joi.string().allow("", null).optional(),
  status: Joi.string().valid("open", "cancelled").optional(),
});

const createPickupSchema = Joi.object({
  listing_id: Joi.string().uuid().required(),
  scheduled_at: Joi.date().iso().required(),
  pickup_address: Joi.string().required(),
  lat: Joi.number().optional(),
  lon: Joi.number().optional(),
});

const completePickupSchema = Joi.object({
  final_weight: Joi.number().positive().optional(),
  notes: Joi.string().allow("", null).optional(),
});

const updateLocationSchema = Joi.object({
  lat: Joi.number().required(),
  lon: Joi.number().required(),
  pickup_request_id: Joi.string().uuid().optional(),
});

const createPaymentIntentSchema = Joi.object({
  pickup_request_id: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(1).max(100).allow("", null).optional(),
  phone: Joi.string().allow("", null).optional(),
  address: Joi.string().allow("", null).optional(),
  city: Joi.string().allow("", null).optional(),
  state: Joi.string().allow("", null).optional(),
  pincode: Joi.string().allow("", null).optional(),
  lat: Joi.number().allow(null).optional(),
  lon: Joi.number().allow(null).optional(),
});

/**
 * Middleware to validate request body against schema
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.details.map((d) => d.message),
      });
    }
    req.validatedData = value;
    next();
  };
};

module.exports = {
  signupSchema,
  loginSchema,
  refreshSchema,
  createListingSchema,
  updateListingSchema,
  createPickupSchema,
  completePickupSchema,
  updateLocationSchema,
  createPaymentIntentSchema,
  updateProfileSchema,
  validateRequest,
};
