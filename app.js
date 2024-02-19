import express from 'express';
import postrouter from './router/router.js';
import cookie from 'cookie-parser';
// import swaggerjsdoc from 'swagger-jsdoc';
// import swaggerui from 'swagger-ui-express';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookie());


// const options = {
//     definition: {
//       openapi: '3.0.0',
//       info: {
//         title: 'Rest Api',
//         version: '1.0.0',
//         description : "이력서 API Swagger 문서 입니다.",
//       },
//     },
//     apis: ['./router/*.js'], 
//   };
  
//   const openapispact = swaggerjsdoc(options);
//   app.use('/api-docs' , swaggerui.serve, swaggerui.setup(openapispact));


app.use('/api', [postrouter]);

app.listen(PORT, () => {
    console.log(PORT, "에 연결되었습니다.");
});