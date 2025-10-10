import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { CATEGORY } from '../constants/category.js';

const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

export const getAllProductsSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string().valid(...CATEGORY),
    search: Joi.string().allow(''),
  }),
};

export const productIdSchema = {
  [Segments.PARAMS]: Joi.object({
    productId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const createProductSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(1).required().messages({
      'string.base': 'Name must be a string',
      'string.min': 'Name should have at least {#limit} characters',
      'any.required': 'Name is required',
    }),
    price: Joi.number().integer().min(1).max(1000).required().messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price must be at least {#limit}',
      'number.max': 'Price must be at most {#limit}',
      'any.required': 'Price is required',
    }),
    category: Joi.string()
      .valid('books', 'electronics', 'clothing', 'other')
      .required()
      .messages({
        'any.only':
          'Category must be one of: books, electronics, clothing or other',
        'any.required': 'Category is required',
      }),
    description: Joi.string().required().messages({
      'string.base': 'Description must be a string',
    }),
  }),
};

export const updateProductSchema = {
  [Segments.PARAMS]: Joi.object({
    productId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(1),
    price: Joi.number().min(1),
    description: Joi.string().allow(''),
  }).min(1),
};
