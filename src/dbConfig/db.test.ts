import db from "./dbConfig.js";

afterAll(async() => {
    // await db('users').truncate();
    db.destroy(() => console.log('db destroyed'));
});

describe('testing knex', () => {
    it('can create a user', async() => {
        let count : number | undefined | string;
        try {
            await db('users').insert({ name: 'test', email: 'test@example.com', password: 'string12', created_at : new Date() });
            console.log("Data inserted");
            const returnedObj = await db('users').count('* as total');
            if (returnedObj[0])count = returnedObj[0].total
            
        } catch (err) {
            console.error(err);
        }

        expect(count).toEqual(1);
    });

    it('can validate and detect duplicate records', async() => {
        let count : number | undefined | string;
        try {
            await db('users').insert({ name: 'tested', email: 'tested@example.com', password: 'string12' });
            console.log("Data inserted");
            const returnedObj = await db('users').count('* as total');
            if (returnedObj[0])count = returnedObj[0].total
            
        } catch (err) {
            console.error(err);
        }

        expect(count).toBeUndefined();
    });

    it('can fetch exisitng record', async() => {
        let user : any;
        try {
            user = await db('users')
            .where({ email: 'test@example.com' })
            .first();
            
        } catch (err) {
            console.error(err);
        }
        finally {
            console.log(user)
        }

        expect(user).not.toBeUndefined();
    });

})