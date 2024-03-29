// Unit test for the Routes:

const request = require('supertest');
const app = require('../../server');

require("dotenv").config();

const newProductData = {
  name: 'Test Product',
  price: 10,
  category: 'Test Category'
};

const newProductDataVide = {
  name: '',
  price: 10,
  category: ''
};


describe("GET: /api/v1/products", () => {
  test("should return all products and status 200", async () => {
    return await request(app)
      .get("/api/v1/products")
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.statusCode).toBe(200);
      })
  }
  )
})

describe("POST: /api/v1/products", () => {
  test('should create a new product', async () => {

    return await request(app)
      .post('/api/v1/products')
      .set('Authorization', 'Bearer TOKEN')
      .send(newProductData)
      .expect(201)
      .then((response) => {
        expect(response.statusCode).toBe(201);
      })
  });

  test('should return an error when creating a new product with missing data', async () => {

    return await request(app)
      .post('/api/v1/products')
      .set('Authorization', 'Bearer TOKEN')
      .send(newProductDataVide)
      .expect(400)
      .then((response) => {
        expect(response.statusCode).toBe(400);
      })
  });

});
