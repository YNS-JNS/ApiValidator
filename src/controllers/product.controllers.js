const ProductModel = require('../models/product.model');

/**
 * @desc Creates a new product.
 * @param req The request object, containing the body of the product to create.
 * @param res The response object, used to send the result of the creation.
 * @returns {Promise<void>} A promise that resolves when the product is created, or rejects with an error message.
*/
exports.createProduct = async (req, res) => {
  try {
    const product = await ProductModel.create(req.body);
    res.status(201).json({message: 'Product created successfully', product});
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
    res.status(200).json({message: 'Products found successfully', totalItems: products.length, products});
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
  try {
    // Find the product in the database by its ID
    const product = await ProductModel.findById(req.params.id);

    // If the product is not found, send a 404 error message
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Send the retrieved product in the response
    res.status(200).json({message: 'Product found successfully', product});
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
