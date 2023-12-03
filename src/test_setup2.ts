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
  `DROP TABLE packages;`,
  `DROP TABLE users;`,
  `DROP TABLE user_histories;`,
  `DROP TABLE permissions;`,
  `DROP TABLE roles;`,

  `CREATE TABLE \`packages\` (
	  \`id\` INT NOT NULL AUTO_INCREMENT,
	  \`name\` VARCHAR(255) NOT NULL,
	  \`package_id\` VARCHAR(255) NOT NULL,
	  \`version\` VARCHAR(255) NOT NULL,
	  \`description\` TEXT,
	  \`bus_factor\` FLOAT,
	  \`correctness\` FLOAT ,
	  \`ramp_up\` FLOAT,
	  \`responsive_maintainer\` FLOAT,
	  \`license_score\` FLOAT,
	  \`good_pinning_practice\` FLOAT,
	  \`pull_request\` FLOAT,
	  \`net_score\` FLOAT,
	  \`zip\` LONGBLOB NOT NULL,
	  \`url\` TEXT,
	  \`js_program\` TEXT,
	  PRIMARY KEY (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;`,
  
  `INSERT INTO ece461db.packages 
  (name, package_id, version, description, 
  bus_factor, correctness, ramp_up, responsive_maintainer, 
  license_score, good_pinning_practice, pull_request, net_score, 
  zip, url, js_program) VALUES ('test', 'test1.0.0', '1.0.0', 'testing this package', 
  '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '0.1', '0.2', 
  'test.zip', 'test.com', 'test.js');`

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

