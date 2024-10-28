"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig_js_1 = __importDefault(require("./dbConfig.js"));
afterAll(() => {
    dbConfig_js_1.default.destroy(() => console.log('db destroyed'));
});
describe('testing knex', () => {
    it('can create a user', async () => {
        let count;
        try {
            await (0, dbConfig_js_1.default)('users').insert({ name: 'John Doe', email: 'john@example.com', password: 'string12' });
            console.log("Data inserted");
            const returnedObj = await (0, dbConfig_js_1.default)('users').count('* as total');
            if (returnedObj[0])
                count = returnedObj[0].total;
        }
        catch (err) {
            console.error(err);
        }
        expect(count).toEqual(1);
    });
});
