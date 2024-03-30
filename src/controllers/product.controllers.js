const ProductModel = require('../models/product.model');
const Joi = require('joi');

const checkingId = (id) => {
  const idSchema = Joi.string().pattern(
    new RegExp('^[0-9a-fA-F]{24}$')
  );
  return idSchema.validate(id);
}

const createNewProduct = (data) => {
  const productSchema = Joi.object({
    name: Joi.string().required().min(2).max(45),
    price: Joi.number().required(),
    category: Joi.string().required().min(2).max(24),
  });
  return productSchema.validate(data);
};

const updateProduct = (data) => {

  const updateSchema = Joi.object({
    name: Joi.string().min(2).max(45),
    price: Joi.number(),
    category: Joi.string().min(2).max(24),
  }).min(1); // * At least one field must be present

  return updateSchema.validate(data);
}

/**
 * @desc Creates a new product.
 * @param req The request object, containing the body of the product to create.
 * @param res The response object, used to send the result of the creation.
 * @returns {Promise<void>} A promise that resolves when the product is created, or rejects with an error message.
*/
exports.createProduct = async (req, res) => {

  const { error } = createNewProduct(req.body);

  if (error) {

    return res.status(400).json({
      status: 400,
      // message: error.details[0].message
      message: "All fields are required"
    });
  }

  try {
    const product = await ProductModel.create(req.body);
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Retrieves all products from the database and sends them in the response.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves when the products are successfully retrieved and sent in the response, or rejects with an error message.
*/
exports.getAllProducts = async (req, res) => {
  try {
    // Retrieves all products from the database
    const products = await ProductModel.find({});

    // Sends the retrieved products in the response
    res.status(200).json({ message: 'Products found successfully', totalItems: products.length, products });
  } catch (error) {
    // If there's an error, sends the error message in the response
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Retrieves a product by its ID from the database and sends it in the response.
 * @param {Object} req - The request object. It should contain the ID of the product in req.params.id.
 * @param {Object} res - The response object. It sends the retrieved product in the response.
 * @returns {Promise<void>} A promise that resolves when the product is successfully retrieved and sent in the response, or rejects with an error message.
 */
exports.getProductById = async (req, res) => {

  const { error: idError } = checkingId(req.params.id);

  if (idError) {
    return res.status(400).json({
      status: 400,
      message: `Product Id = ${req.params.id} is invalid !`
    });
  }

  try {
    // Find the product in the database by its ID
    const product = await ProductModel.findById(req.params.id);

    // If the product is not found, send a 404 error message
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Send the retrieved product in the response
    res.status(200).json({ message: 'Product found successfully', product });
  } catch (error) {
    // If there's an error, send the error message in the response
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Updates a product by its ID.
 * @param {Object} req - The request object. It should contain the ID of the product in req.params.id
 * and the updated product in req.body.
 * @param {Object} res - The response object. It sends the updated product in the response.
 * @returns {Promise<void>} A promise that resolves when the product is successfully updated and sent in the response,
 * or rejects with an error message.
 */
exports.updateProduct = async (req, res) => {

  const { error: idError } = checkingId(req.params.id);

  if (idError) {

    return res.status(400).json({
      status: 400,
      message: `Product Id = ${req.params.id} is invalid !`
    });
  }

  const { error: dataError } = updateProduct(req.body, { abortEarly: false });

  // { abortEarly: false }: vous obtiendrez toutes les erreurs de validation à la fois

  // If the validation fails, send a 400 error with the error messages.
  if (dataError) {

    // Map the error details to get all the error messages.
    const errorMessage = dataError.details.map(detail => detail.message);

    // Send a 400 error response with the error messages.
    return res.status(400).json({
      status: 400,
      // message: errorMessage
      message: "Invalid data",
    })
  }

  try {
    // Find the product in the database by its ID and update it with the provided data
    const product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // If the product is not found, send a 404 error message
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Send the updated product in the response
    res.status(200).json({ message: 'Product updated successfully', product: product });
  } catch (error) {
    // If there's an error, send the error message in the response
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Deletes a product by its ID.
 * @param {Object} req - The request object. It should contain the ID of the product in req.params.id.
 * @param {Object} res - The response object. It sends a success message in the response.
 * @returns {Promise<void>} A promise that resolves when the product is successfully deleted and sends a success message in the response,
 * or rejects with an error message.
 */
exports.deleteProduct = async (req, res) => {

  const { error: idError } = checkingId(req.params.id);

  if (idError) {

    return res.status(400).json({
      status: 400,
      message: `Product Id = ${req.params.id} is invalid !`
    });
  }

  try {
    // Find and delete the product in the database by its ID
    const product = await ProductModel.findByIdAndDelete(req.params.id);

    // If the product is not found, send a 404 error message
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Send a success message in the response
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    // If there's an error, send the error message in the response
    res.status(500).json({ error: error.message });
  }
};
