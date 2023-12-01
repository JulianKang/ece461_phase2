import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
};

async function showTablesAndContents() {
  // Create a MySQL connection pool
  const pool = mysql.createPool(dbConfig);

  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Fetch tables from the database
    const [tablesResult] = await connection.query('SHOW TABLES');

    // Loop through tables and display contents
    for (const tableRow of tablesResult as any[]) {
      const tableName = tableRow[`Tables_in_${dbConfig.database}`];

      // Display table name
      console.log(`Table: ${tableName}`);

      // Fetch and display table contents
      const [contentsResult] = await connection.query(`SELECT * FROM ${tableName}`);
      console.log(contentsResult);

      console.log('------------------------');
    }

    // Release the connection back to the pool
    connection.release();
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection pool
    pool.end();
  }
}

// Run the function to show tables and contents
showTablesAndContents();
