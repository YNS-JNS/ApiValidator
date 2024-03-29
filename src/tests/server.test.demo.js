// Jest: Jest is a framework for testing JavaScript code. Unit testing is the main usage of it.

// SuperTest: Using Supertest, we can test endpoints and routes on HTTP servers.

const request = require('supertest'); // request function to make the HTTP request to the Express app
const app = require('../../server');

describe("GET: /api/v1/hello", () => {
    test("should return message: Node.js Express testing with Jest and SuperTest and status 200", async () => {
        const result = await request(app).get('/api/v1/hello')
        expect(result.status).toBe(200);
        expect(result.body).toEqual({ message: "Node.js Express testing with Jest and SuperTest" })
    })
});

/*
 * Other method:
describe("GET: /api/v1/hello", () => {
    test("should return message: Hello, World! and status 200", async () => {

        return await request(app).get('/api/v1/hello')
            .expect('Content-Type', /json/)
            .expect(200);
    })
});
*/
