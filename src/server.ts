import dotenv from 'dotenv';
import { app } from './app.js';

dotenv.config({
  path: './.env',
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
