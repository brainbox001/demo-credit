import db from "./dbConfig.js";

afterAll(() => {
    db.destroy(() => console.log('db destroyed'))
});

describe('testing knex', () => {
    it('can create a user', async() => {
        let count : number | undefined | string;
        try {
            await db('users').insert({ name: 'John Doe', email: 'john@example.com', password: 'string12' });
            console.log("Data inserted");
            const returnedObj = await db('users').count('* as total');
            if (returnedObj[0])count = returnedObj[0].total
            
        } catch (err) {
            console.error(err);
        }

        expect(count).toEqual(1);
    })
})