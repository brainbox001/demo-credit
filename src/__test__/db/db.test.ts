import db from "../../dbConfig/dbConfig";

afterAll(async() => {
    await db('users').truncate();
    await db('transactions').truncate();
    db.destroy(() => console.log('db destroyed'));
});

describe('testing knex', () => {
    it('can create a user', async() => {
        let count : number | undefined | string;
        try {
            await db('users').insert({ name: 'test', email: 'test@example.com', password: 'string12', accountNumber : 904111383, created_at : new Date() });
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
            await db('users').insert({ name: 'test', email: 'test@example.com', password: 'string12', accountNumber : 904111383, created_at : new Date() });
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

    it('can update a record', async() => {
        let user : any;
        let userEmail = 'test@example.com'
        try {
            user = await db('users')
            .where({ email: userEmail })
            .first()
            .update({balance : 600})
            
        } catch (err) {
            console.error(err);
        }
        finally {
            console.log("updated user", user)
        }

        expect(user).not.toBeUndefined();
    });

    it('testing the whereIn method', async() => {
        let user : any;
        try {
            await db('users').insert({ name: 'tested', email: 'tested@example.com', password: 'string123', accountNumber : 816895855, created_at : new Date() });
            let userId = [2, 1]
            user = await db('users').whereIn('id', userId).select('id', 'email', 'accountNumber');
        } catch (err) {
            console.error(err);
        }
        finally {
            console.log("user returned by wherein", user)
        }

        expect(user[0].id).toBe(1);
        expect(user[1].id).toBe(2);
    });

    it('test chaining', async() => {
        // Note : test failed, knex can't handle this type of chaining
        let user : any;
        try {

            user = await db('users')
            .where({accountNumber : 904111383})
            .update({balance : 300})
            .where({accountNumber : 812377478})
            .update({balance : 600});
        } catch (err) {
            console.error(err);
        }
        finally {
            console.log("user returned by chaining", user)
        }
        // Test confirmed in the database
        expect(user).not.toBeUndefined();
    });

    it('testing the transaction table :- can store foreign key references', async() => {
        let count : number | undefined | string;
        try {
            const newTrans = await db('transactions').insert({
                transType : 'fund',
                sender : 904111383,
                amount : 200,
                created_at : new Date()
            });
            console.log("Data inserted", newTrans);
            const returnedObj = await db('transactions').count('* as total');
            if (returnedObj[0])count = returnedObj[0].total
            
        } catch (err) {
            console.error(err);
        }

        expect(count).toEqual(1);
    });

});