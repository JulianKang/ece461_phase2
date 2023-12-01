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
  // Drop and create database
  `DROP DATABASE IF EXISTS ece461db;`,
  `CREATE DATABASE ece461db;`,
  `USE ece461db;`,
  
  // @block Create Tables
  `CREATE TABLE \`users\` (
      \`id\` INT NOT NULL AUTO_INCREMENT,
      \`username\` VARCHAR(255) NOT NULL UNIQUE,
      \`password\` VARCHAR(255) NOT NULL,
      \`user_type\` INT NOT NULL,
      \`api_key\` VARCHAR(255) NOT NULL,
      \`api_timestamp\` DATETIME NOT NULL,
      PRIMARY KEY (\`id\`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;`,

  `CREATE TABLE \`user_histories\` (
      \`id\` INT NOT NULL AUTO_INCREMENT,
      \`user_id\` INT NOT NULL,
      \`package_id\` INT NOT NULL,
      \`use_date\` DATETIME NOT NULL,
      \`use_type\` VARCHAR(255) NOT NULL,
      PRIMARY KEY (\`id\`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;`,

  `CREATE TABLE \`packages\` (
      \`id\` INT NOT NULL AUTO_INCREMENT,
      \`name\` VARCHAR(255) NOT NULL,
      \`description\` TEXT NOT NULL,
      \`size\` INT NOT NULL,
      \`user_id\` INT NOT NULL,
      \`upload_date\` DATETIME NOT NULL,
      \`zip\` LONGBLOB NOT NULL,
      \`stars\` FLOAT NOT NULL,
      \`sensitivity\` VARCHAR(255) NOT NULL,
      \`download_count\` INT NOT NULL DEFAULT 0,
      PRIMARY KEY (\`id\`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;`,

  `CREATE TABLE \`roles\` (
      \`role_id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`role_name\` VARCHAR(255) NOT NULL
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;`,

  `CREATE TABLE \`permissions\` (
      \`permission_id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`role_id\` INT,
      \`query_type\` ENUM('SELECT', 'INSERT', 'UPDATE', 'DELETE'),
      \`query\` VARCHAR(1000)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;`,

  // Block Create Foreign Keys
  `ALTER TABLE \`user_histories\` ADD FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`);`,
  `ALTER TABLE \`user_histories\` ADD FOREIGN KEY (\`package_id\`) REFERENCES \`packages\`(\`id\`);`,
  `ALTER TABLE \`users\` ADD FOREIGN KEY (\`user_type\`) REFERENCES \`roles\`(\`role_id\`);`,
  `ALTER TABLE \`permissions\` ADD FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`role_id\`);`,
  `ALTER TABLE \`packages\` ADD FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`);`,

  // @block Insert Data USER
  `INSERT INTO roles (role_name) VALUES ('admin');`,
  `INSERT INTO roles (role_name) VALUES ('user');`,
  `INSERT INTO ece461db.users (
      username,
      password,
      user_type,
      api_key,
      api_timestamp
    )
  VALUES (
      'nbielans',
      'password123',
      '1',
      'asdsad',
      NOW()
    );`,

  // @block Insert Data PACKAGE
  `INSERT INTO ece461db.packages (name, description, size, user_id, upload_date, zip, stars, sensitivity, download_count)
  VALUES ('Test Package', 'This is a test package', 100, 1, NOW(), 'test.zip', 0, 'low', 100);`,

  `SET @package_id = LAST_INSERT_ID();`,

  // Creating user_history for associated upload
  `INSERT INTO ece461db.user_histories (user_id, package_id, use_date, use_type)
  VALUES (1, @package_id, NOW(), 'upload');`,

  // @block Insert Data PERMISSIONS
  `INSERT INTO ece461db.permissions (role_id, query_type, query)
  VALUES (1, 'SELECT', 'SELECT * FROM users');`,
  
  `INSERT INTO ece461db.permissions (role_id, query_type, query)
  VALUES (2, 'SELECT', 'SELECT * FROM packages');`
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

