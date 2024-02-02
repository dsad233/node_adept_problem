import express from 'express';
import postrouter from './router/router.js';
import cookie from 'cookie-parser';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookie());

app.use('/test', async (req, res, next) => {
    console.log("첫번 째 미들웨어");
    return res.status(201).send("확인");
});

app.use('/api', [postrouter]);

app.listen(PORT, () => {
    console.log(PORT, "에 연결되었습니다.");
});