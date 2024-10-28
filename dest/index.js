"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3001;
app.get('/', (req, res) => {
    let userAgent;
    userAgent = req.headers['user-agent'];
    res.status(200).json({ welcome: `Welcome to novel app ${userAgent}` });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
