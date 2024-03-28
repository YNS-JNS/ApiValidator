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
    describe('createProduct', () => {
        test('should create a new product', async () => {
            const req = { body: { name: 'Test Product', price: 10, category: 'Test Category' } };
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


        test('should return error for missing name', async () => {
            const req = { body: { price: 10, category: 'Test Category' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            // Don't mock ProductModel.create here because it's not relevant to this test case

            await productController.createProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 400,
                message: 'name is required'
            });
        });

        // test('should return error for missing name', async () => {
        //     const req = { body: { price: 10, category: 'Test Category' } };
        //     const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        //     ProductModel.create.mockResolvedValueOnce(req.body);

        //     await productController.createProduct(req, res);

        //     expect(ProductModel.create).toHaveBeenCalledWith(req.body);
        //     expect(res.status).toHaveBeenCalledWith(400);
        //     expect(res.json).toHaveBeenCalledWith({
        //         status: 400,
        //         message: "\"name\" is required"
        //     });
        // });

    });

});
