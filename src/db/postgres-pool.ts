import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  // user: process.env.DB_USER,
  // host: 'localhost',
  // database: process.env.DB_NAME,
  // password: process.env.DB_PASS,
  // port: 5432,
});

const connectToDB = async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL');
    client.release();
  } catch (err) {
    console.error('Failed to connect to PostgreSQL:', err);
  }
};

connectToDB();
