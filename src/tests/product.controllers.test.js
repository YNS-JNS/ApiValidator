const productController = require('../controllers/product.controllers');
const ProductModel = require('../models/product.model');

jest.mock('../models/product.model', () => ({
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
}));

describe('Product Controller Tests', () => {

    /**
    * @test {createProduct}
    */
    describe('create a new Product', () => {

        /**
        * @testcase {should create a new product}
        */
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

        /**
        * @testcase {should return error for missing fields}
        */
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

    /**
    * @testcase {getAllProducts}
    */
    describe('get All Products', () => {

        /**
        * @test {should return all products}
        */
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

    /**
    * @testcase {getProductById}
    */
    describe('get a Product By Id', () => {

        /**
        * @test {should return product if ID is valid and product exists}
        */
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

        /**
        * @test {should return error if ID is not valid}
        */
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

        /**
        * @test {should return error if product is not found}
        */
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

        /**
        * @test {should return error if there is an internal server error}
        */
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

    /**
    * @testcase {updateProduct}
    */
    describe('Update a product', () => {

        /**
        * @test {should update a product}
        */
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

        /**
        * @test {should return error if ID is not valid}
        */
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

        /**
        * @test {should return error if product is not found}
        */
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

        /**
        * @testcase {should return error for missing fields}
        */
        test('should return error for missing fields', async () => {
            // missing name field
            const req = { body: { category: '' }, params: { id: '5f7777777777777777777777' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await productController.updateProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 400,
                message: "Invalid data",
            });
        });
    });

    /**
    * @testcase {deleteProduct}
    */
    describe('Delete a Product', () => {

        /**
        * @test {should delete a product}
        */
        test('should delete a product', async () => {
            // Mocked product data
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

            // Mock ProductModel.findByIdAndDelete to return product data
            ProductModel.findByIdAndDelete.mockResolvedValueOnce(productData);

            // Call the controller function
            await productController.deleteProduct(req, res);

            // Expectations
            expect(ProductModel.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Product deleted successfully' });
        });

        /**
        * @test {should return error if ID is invalid}
        */
        test('should return error if ID is invalid', async () => {
            const req = {
                params: { id: 'invalid_id' }
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await productController.deleteProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 400,
                message: `Product Id = ${req.params.id} is invalid !`
            });
        });

        /**
        * @test {should return error if product is not found}
        */
        test('should return error if product is not found', async () => {
            const req = {
                params: { id: '5f7777777777777777777777' } // Non-existing ID
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            // Mock ProductModel.findByIdAndDelete to return null, simulating product not found
            ProductModel.findByIdAndDelete.mockResolvedValueOnce(null);

            await productController.deleteProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
        });
    });

});
