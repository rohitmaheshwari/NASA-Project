const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');

describe('Launches API', () => {
    beforeAll(async () => {
        await mongoConnect();
    });

    afterAll(async () => {
        await mongoDisconnect();
    });

    describe('Test GET /launches', () => {
        test('It should respond with 200 success', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect(200)
                .expect('Content-Type', /json/);
            // expect(response.statusCode).toBe(200);
        });
    });

    describe('Test POST /launch', () => {
        const completeLaunchData = {
            mission: "lala land",
            rocket: "Explorer IS1",
            launchDate: "December 27, 2030",
            target: "Kepler-442 b"
        }

        const launchDataWithoutDate = {
            mission: "lala land",
            rocket: "Explorer IS1",
            target: "Kepler-442 b"
        }

        const launchDataWithInvalidDate = {
            mission: "lala land",
            rocket: "Explorer IS1",
            launchDate: "loot",
            target: "Kepler-442 b"
        }

        test('It should respond with 200 success', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect(201)
                .expect('Content-Type', /json/);

            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();

            expect(response.body).toMatchObject(launchDataWithoutDate);
            // console.log(response.launchDate);
        });


        test('It should catch missing required properties', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect(400)
                .expect('Content-Type', /json/);

            expect(response.body).toStrictEqual({
                error: 'Missing required launch property!',
            });
        });

        test('It should catch invalid dates', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithInvalidDate)
                .expect(400)
                .expect('Content-Type', /json/);

            expect(response.body).toStrictEqual({
                error: 'Invalid launch date'
            });
        });
    });
});