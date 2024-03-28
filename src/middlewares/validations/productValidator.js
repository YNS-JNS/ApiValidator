const Joi = require('joi');

/* ____________________________________________________________________ */
/*                     Validation ID (_id is valid)                     */
/* ____________________________________________________________________ */


/**
 * Function to validate the format of a MongoDB ObjectId.
 *
 * @param {string} id - The ID to be validated.
 * @return {Object} An object with a boolean `error` property indicating
 * whether the ID is valid and a `value` property containing the validated
 * ID.
 */
const checkingId = (id) => {
    // Define the schema for the ID.
    // It should be a string of 24 characters,
    // consisting of hexadecimal digits.
    const idSchema = Joi.string().pattern(
        new RegExp('^[0-9a-fA-F]{24}$')
    );

    // Validate the ID against the schema.
    return idSchema.validate(id);
}


/**
 * Middleware function to validate the ID parameter of the request URL.
 * It uses the `checkingId` function to validate the ID.
 * If the ID is not valid, it sends a 400 error response.
 * Otherwise, it calls the next middleware function.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function.
 */
exports.isIdValidator = (req, res, next) => {

    // Validate the ID using the `checkingId` function.
    const { error: idError } = checkingId(req.params.id);

    // If the ID is not valid,
    // send a 400 error response with the invalid ID.
    if (idError) {

        // Send a 400 error response with the error message.
        return res.status(400).json({
            status: 400,
            message: `Product Id = ${req.params.id} is invalid !`
        });
    }

    // If the ID is valid, call the next middleware function.
    next();
};

/* ____________________________________________________________________ */
/*                      Validation Creating Product                     */
/* ____________________________________________________________________ */

/**
 * Function to validate the data for creating a new product.
 * @param {Object} data - The data to be validated.
 * @returns {Object} - The result of the validation.
 */
const createNewProduct = (data) => {

    // Define the schema for the product data.
    const productSchema = Joi.object({

        // The name of the product.
        // It should be a string and should be between 2 to 45 characters.
        name: Joi.string().required().min(2).max(45),

        // The price of the product.
        // It should be a number.
        price: Joi.number().required(),

        // The category of the product.
        // It should be a string and should be between 2 to 24 characters.
        category: Joi.string().required().min(2).max(24),
    });

    // Validate the data against the schema.
    return productSchema.validate(data);
};

/**
 * Middleware to validate the data for creating a new product.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function.
 */
exports.productValidator = (req, res, next) => {

    // Validate the request body against the product schema.
    const { error } = createNewProduct(req.body);

    // If the validation fails, send a 400 error with the error message.
    if (error) {

        // Send a 400 error response.
        return res.status(400).json({
            status: 400,
            message: error.details[0].message
        });
    }

    // If the validation passes, call the next function.
    next();
};

/* ____________________________________________________________________ */
/*                      Validation Updating Product                     */
/* ____________________________________________________________________ */


/**
 * Validates the data for updating a product.
 *
 * @param {Object} data - The data to be validated.
 * @returns {Object} - The result of the validation.
 *   - `error` {Object} - The validation error, if any.
 *   - `value` {Object} - The validated data.
 */
const updateProduct = (data) => {

    const updateSchema = Joi.object({
        name: Joi.string().min(2).max(45),
        price: Joi.number(),
        category: Joi.string().min(2).max(24),
    }).min(1); // * At least one field must be present

    return updateSchema.validate(data);
}


/**
 * Middleware function to validate the data for updating a product.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function.
 */
exports.updateValidator = (req, res, next) => {

    // Validate the request body against the updateProduct schema.
    const { error: dataError } = updateProduct(req.body, { abortEarly: false });

    // If the validation fails, send a 400 error with the error messages.
    if (dataError) {

        // Map the error details to get all the error messages.
        const errorMessage = dataError.details.map(detail => detail.message);

        // Send a 400 error response with the error messages.
        return res.status(400).json({
            status: 400,
            message: errorMessage
        })
    }

    // If the validation passes, call the next middleware function.
    next();
};
