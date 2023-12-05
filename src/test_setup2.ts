import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
const serverConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  //port: parseInt(process.env.DB_PORT || '3306'),
};

const newDatabaseName = 'ece461db';

// Individual SQL statements
const commands = [

  `USE ece461db;`,
  `ALTER TABLE packages ADD CONSTRAINT UQ_package_id UNIQUE (package_id);`

];


async function setupDatabase() {
  const pool = mysql.createPool(serverConfig);

  try {
    const connection = await pool.getConnection();

    for (const command of commands) {
      await connection.query(command);
    }

    connection.release();

    console.log(`Database setup for ${newDatabaseName} complete`);
  } catch (error) {
    console.error('Error during database setup:', error);
  } finally {
    pool.end();
  }
}

// Run the setup function
setupDatabase();

