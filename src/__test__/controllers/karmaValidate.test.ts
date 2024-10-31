import registerObj from "../../controllers/users/register";

const {karmaValidate} = registerObj;

describe('karma blacklist validation', () => {
    it('returns 404 status for not found users', async () => {
        let response = await karmaValidate('test@example.com');
        expect(response).toBe(404);
    });

    it ('returns status 200 for users found', async() => {
        let response = await karmaValidate('0zspgifzbo.ga');
        expect(response).toBe(200);
    });
})