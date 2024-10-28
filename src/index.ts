import express, { Request, Response, NextFunction } from "express";

const app = express();
const port = 3001;

app.get('/', (req: Request, res: Response) => {
    let userAgent: string | undefined;
    userAgent = req.headers['user-agent']
      res.status(200).json({welcome: `Welcome to novel app ${userAgent}`})
    });

app.use((err: any, req:Request, res:Response, next:NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
});