const productController = require('../controllers/product.controllers');
const ProductModel = require('../models/product.model');

jest.mock('../models/product.model', () => ({
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
}));

/**
 * @desc Unit test for POST
*/
describe('Product Controller Tests', () => {

    // Create a new product
    describe('create a new Product', () => {

        // Create a new product successfully
        test('should create a new product', async () => {
            const req = {
                body: {
                    name: 'Test Product',
                    price: 10,
                    category: 'Test Category'
                }
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            ProductModel.create.mockResolvedValueOnce(req.body);

            await productController.createProduct(req, res);

            expect(ProductModel.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Product created successfully',
                product: req.body,
            });
        });

        // Return error for missing product fields
        test('should return error for missing fields', async () => {
            // missing name field
            const req = { body: { price: 10, category: 'Test Category' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            // Don't mock ProductModel.create here because it's not relevant to this test case

            await productController.createProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 400,
                message: "All fields are required"
            });
        });
    });

    // Retrieve all products from
    describe('get All Products', () => {

        // Retrieve all products successfully
        test('should return all products', async () => {
            const req = {};
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            const products = [{ name: 'Test Product', price: 10, category: 'Test Category' }, { name: 'Test Product', price: 10, category: 'Test Category' }];

            ProductModel.find.mockResolvedValueOnce(products);

            await productController.getAllProducts(req, res);

            expect(ProductModel.find).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Products found successfully',
                totalItems: products.length,
                products,
            });
        })
    });

    // Update product by ID
    describe('Update a product', () => {

        // Update a product successfully
        test('should update a product', async () => {
            const req = {
                body: {
                    name: 'Updated Product',
                    price: 10,
                    category: 'Test Category'
                },
                params: { id: '5f7777777777777777777777' }
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            const product = { name: 'Test Product', price: 10, category: 'Test Category' };

            ProductModel.findByIdAndUpdate.mockResolvedValueOnce(product);

            await productController.updateProduct(req, res);

            expect(ProductModel.findByIdAndUpdate).toHaveBeenCalledWith(req.params.id, req.body, { new: true });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Product updated successfully',
                product,
            });
        });

        // ID is not valid
        test('should return error if ID is not valid', async () => {
            const req = {
                body: {
                    name: 'Updated Product',
                    price: 10,
                    category: 'Test Category'
                },
                params: { id: '5f77777777777777777777k' }
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await productController.updateProduct(req, res);

            // Ensure ProductModel.findByIdAndUpdate is not called
            expect(ProductModel.findByIdAndUpdate).not.toHaveBeenCalledWith();

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 400,
                message: `Product Id = ${req.params.id} is invalid !`
            });
        });

        // Product is not found
        test('should return error if product is not found', async () => {
            const req = {
                body: {
                    name: 'Updated Product',
                    price: 10,
                    category: 'Test Category'
                },
                params: { id: '5f7777777777777777777777' } // Valid Id but product not exist
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            // Mock ProductModel.findByIdAndUpdate to return null, simulating product not found
            ProductModel.findByIdAndUpdate.mockResolvedValueOnce(null);

            await productController.updateProduct(req, res);

            // Ensure the correct response is sent
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Product not found'
            });
        });

        
    });

    // Get a product by ID
    describe('get a Product By Id', () => {

        // Get a product by ID successfully
        test('should return product if ID is valid and product exists', async () => {
            // Mock product data
            const productData = {
                _id: '5f7777777777777777777777',
                name: 'Test Product',
                price: 10,
                category: 'Test Category'
            };

            // Mock request object
            const req = {
                params: { id: productData._id }
            };

            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Mock ProductModel.findById to return product data
            ProductModel.findById.mockResolvedValueOnce(productData);

            // Call the controller function
            await productController.getProductById(req, res);

            // Expectations
            expect(ProductModel.findById).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Product found successfully',
                product: productData
            });
        });

        // Return error if ID is not valid
        test('should return error if ID is not valid', async () => {
            const req = {
                body: {
                    name: 'Test Product',
                    price: 10,
                    category: 'Test Category'
                },
                params: { id: '5f77777777777777777777k' }
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await productController.getProductById(req, res);

            // Ensure ProductModel.findByIdAndUpdate is not called
            expect(ProductModel.findById).not.toHaveBeenCalledWith();

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 400,
                message: `Product Id = ${req.params.id} is invalid !`
            });
        });

        // Return error if product is not found
        test('should return error if product is not found', async () => {
            // Mock request object
            const req = {
                params: { id: '5f7777777777777777777777' } // Non-existing ID
            };

            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Mock ProductModel.findById to return null, simulating product not found
            ProductModel.findById.mockResolvedValueOnce(null);

            // Call the controller function
            await productController.getProductById(req, res);

            // Expectations
            expect(ProductModel.findById).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Product not found'
            });
        });

        // Return error if there's an internal server error
        test('should return error if there is an internal server error', async () => {
            // Mock request object
            const req = {
                params: { id: '5f7777777777777777777777' } // Existing ID
            };

            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Mock ProductModel.findById to throw an error, simulating an internal server error
            ProductModel.findById.mockRejectedValueOnce(new Error('Internal server error'));

            // Call the controller function
            await productController.getProductById(req, res);

            // Expectations
            expect(ProductModel.findById).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });


    });

    // Delete a product
});
