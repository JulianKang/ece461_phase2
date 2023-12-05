/**
 * dbCommunicator.ts - A class for interacting with a MySQL database using the mysql2 library.
 */

import mysql from 'mysql2/promise';
import logger from '../src/logger';
import 'dotenv/config';
import { type } from 'node:os';
import * as Schemas from '../src/schemas';
//require('mysql2/node_modules/iconv-lite').encodingExists('foo');

/** 
 * An enum for the different user types.
 * Highest permission level is admin, lowest is guest.
 * Keep user type values in order from lowest to highest permission level (if possible).
 */
export enum userType {
  guest,
  user,
  admin
}

/**
 * Database configuration object.
 */
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
};
if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database) {
    logger.error('Missing database configuration.');
    process.exit(1);
}
type QueryResult = mysql.OkPacket | mysql.RowDataPacket[] | mysql.ResultSetHeader[] | mysql.RowDataPacket[][] | mysql.OkPacket[] | mysql.ProcedureCallPacket;

/* TODO List / Things to Implement/Consider:
    * - Add the logger to the DBCommunicator class
    * - Create authorization levels for the database
    * - Add a way to check user permissions for certain queries (function, method, etc.)
    * - tests
    * - Database Connection Pooling:
        Consider using a connection pool for your database connections. 
        Connection pooling can help improve performance and security. 
        It manages the connections efficiently, reducing the risk of 
        resource exhaustion and other issues.
    * - SQL Injection Prevention:
        Your code currently uses parameterized queries, which is a good 
        practice to prevent SQL injection. However, it's essential to 
        ensure that all SQL queries, even dynamic ones, are properly 
        parameterized to eliminate the risk of injection.    
    * - Authentication and Authorization:
        This code snippet does not address authentication and authorization, 
        which are critical components of database security. Ensure that your 
        MySQL server is properly configured with user accounts and access 
        control to limit the exposure of your database.
    * - Secure Your Environment:
        Make sure your production environment is adequately secured, including 
        firewalls, intrusion detection, and monitoring systems.
    * - Data Encryption:
        Ensure that your database connections are encrypted, especially for 
        production environments. MySQL supports SSL/TLS encryption for secure data transmission.
    * - Data Validation:
        Ensure that any data passed into SQL queries is validated and sanitized. 
        This includes not just parameterized queries but also checking data types 
        and lengths to prevent data-related vulnerabilities.
    * - Audit Trails:
        Consider adding audit trails to log and monitor all activities within the 
        database to detect and respond to any suspicious or unauthorized behavior.
 */

/**
 * A class for interacting with a MySQL database using the mysql2 library.
 */
class DBCommunicator {
  private connection : mysql.Connection | null = null;
  private authorization : string | null = null;

  /**
   * Constructor for DBCommunicator.
   * It establishes a connection to the MySQL database.
   */
  constructor() {
    this.connect();
  }

  /**
   * Establishes a connection to the MySQL database.
   */
  private async connect() {
    try {
      this.connection = await mysql.createConnection(dbConfig);
      logger.info('Connected to MySQL database'); // replace with logger when we gain access to it
    } catch (error) {
      logger.error('Error connecting to the database:' + error); // replace with logger when we gain access to it
    }
  }

  //TODO: Figure out versions; TEST

  public async resetRegistry(): Promise<boolean> {
    const sql = "DELETE FROM packages";
    const result : QueryResult | null | number = await this.query(sql);
    console.log("RESET: " + JSON.stringify(result));
    if (result == null || (result as mysql.ResultSetHeader).affectedRows == 0 || typeof(result) == "number") {
      return false;
    }
    return true;
  }

  public async searchPackagesByRegex(regex: Schemas.PackageRegEx): Promise<Schemas.PackageMetadata[]> {
    const sql = "SELECT name, version, package_id FROM packages WHERE name REGEXP ? OR description REGEXP ?";
    const values = [regex, regex];
    const result : QueryResult | null | number = await this.query(sql, values);
    if (result == null || !Array.isArray(result) || result.length === 0 || typeof(result) == "number") {
      return [];
    }

    let packageMetaList: Schemas.PackageMetadata[] = [];

    for(let i = 0; i < result.length; i++){
      const packageID: Schemas.PackageID = (result[i] as mysql.RowDataPacket).package_id;
      const packageName: Schemas.PackageID = (result[i] as mysql.RowDataPacket).name;
      const packageMeta: Schemas.PackageMetadata = {
        Name: packageName,
        Version: (result[i] as mysql.RowDataPacket).version,
        ID: packageID
      }

      packageMetaList.push(packageMeta);
    }

    return packageMetaList;
  }

  public async injestPackage(newPackage: Schemas.Package, newDescription: string | null): Promise<number> {
    const sql = "INSERT INTO packages (name, package_id, version, zip, js_program, url, description) VALUES(?, ?, ?, ?, ?, ?, ?)";
    const values = [newPackage.metadata.Name, newPackage.metadata.ID, newPackage.metadata.Version, newPackage.data.Content, newPackage.data.JSProgram, newPackage.data.URL, newDescription]; 
    const result : QueryResult | null | number = await this.query(sql, values);
    if(typeof(result) == "number" && result == -1){
      return -1; //PACKAGE EXISTS
    }
    else if (result == null || (result as mysql.ResultSetHeader).affectedRows == 0 || typeof(result) == "number") {
      return 0; //ANY ERROR
    }
    return 1;

  }

  public async updatePackageById(newPackage: Schemas.Package): Promise<boolean> {
    let sql;
    let values;
    if(Schemas.Evaluate.isPackageURL(newPackage.data.URL)){
      sql = "UPDATE packages SET url = ? WHERE package_id = ? AND name = ? AND version = ?";
      values = [newPackage.data.URL, newPackage.metadata.ID, newPackage.metadata.Name, newPackage.metadata.Version];
    }
    else if(Schemas.Evaluate.isPackageContent(newPackage.data.Content)){
      sql = "UPDATE packages SET zip = ? WHERE package_id = ? AND name = ? AND version = ?";
      values = [newPackage.data.Content, newPackage.metadata.ID, newPackage.metadata.Name, newPackage.metadata.Version];
    }
    else {
      return false;
    }
    const result : QueryResult | null | number = await this.query(sql, values);
    if (result == null || (result as mysql.ResultSetHeader).affectedRows == 0 || typeof(result) == "number") {
      return false;
    }
    return true;
  }

  public async getPackageMetadata(packageName: Schemas.PackageName, packageVersion: string): Promise<Schemas.PackageMetadata[]> {
    //ADD HANDLING FOR DIFFERENT VERSION TYPES!!!!!
    let sql;
    const values = [packageName, packageVersion]; 
    if(packageName == "*"){
      sql = "SELECT name, package_id, version FROM packages;";
    }
    else{
      sql = "SELECT name, package_id, version FROM packages WHERE name = ? AND version = ?;";
    }
    const result : QueryResult | null | number = await this.query(sql, values);
    if (result == null || !Array.isArray(result) || result.length === 0 || typeof(result) == "number") {
      return [];
    }
    
    
    let packageMetaList: Schemas.PackageMetadata[] = [];

    for(let i = 0; i < result.length; i++){
      const packageID: Schemas.PackageID = (result[i] as mysql.RowDataPacket).package_id;
      const newPackageName: Schemas.PackageName = (result[i] as mysql.RowDataPacket).name;
      const packageMeta: Schemas.PackageMetadata = {
        Name: newPackageName,
        Version: (result[i] as mysql.RowDataPacket).version,
        ID: packageID
      }

      packageMetaList.push(packageMeta);
    }
  
    return packageMetaList;
  }

  public async getPackageById(packageID: Schemas.PackageID): Promise<Schemas.Package | null> {
    const sql = "SELECT name, version, zip, js_program, url FROM packages WHERE package_id = ?";
    const values = [packageID]; 
    const result : QueryResult | null | number = await this.query(sql, values);
      if (result == null || !Array.isArray(result) || result.length === 0 || typeof(result) == "number") {
      return null;
    }

    const packageName: Schemas.PackageName = (result[0] as mysql.RowDataPacket).name;
    const packageMeta: Schemas.PackageMetadata = {
      Name: packageName,
      Version: (result[0] as mysql.RowDataPacket).version,
      ID: packageID
    };
    const packageData: Schemas.PackageData = {
      Content: (result[0] as mysql.RowDataPacket).zip,
      URL: (result[0] as mysql.RowDataPacket).url,
      JSProgram: (result[0] as mysql.RowDataPacket).js_program
    }
    const getPackage: Schemas.Package = {
      metadata: packageMeta,
      data: packageData
    }
    return getPackage;
  }

  public async deletePackageById(packageID: Schemas.PackageID): Promise<boolean> {
    const sql = "DELETE FROM packages WHERE package_id = ?";
    const values = [packageID]; 
    const result : QueryResult | null | number = await this.query(sql, values);
    if (result == null || (result as mysql.ResultSetHeader).affectedRows == 0 || typeof(result) == "number") {
      return false;
    }
    return true;
  }

  public async deletePackageByName(packageName: Schemas.PackageName): Promise<boolean> {
    const sql = "DELETE FROM packages WHERE name = ?";
    const values = [packageName]; 
    const result : QueryResult | null | number = await this.query(sql, values);
    if (result == null || (result as mysql.ResultSetHeader).affectedRows == 0 || typeof(result) == "number") {
      return false;
    }
    return true;
  }

  public async getPackageRatings(packageID: Schemas.PackageID): Promise<Schemas.PackageRating | null> {
    const sql = "SELECT bus_factor, correctness, ramp_up, responsive_maintainer, license_score, good_pinning_practice, pull_request, net_score FROM packages WHERE package_id = ?";
    const values = [packageID]; 
    const result : QueryResult | null | number = await this.query(sql, values);
    if (result == null || !Array.isArray(result) || result.length === 0 || typeof(result) == "number") {
      return null;
    }
    const metrics: Schemas.PackageRating =  {
      BusFactor: (result[0] as mysql.RowDataPacket).bus_factor,
      Correctness: (result[0] as mysql.RowDataPacket).correctness,
      RampUp: (result[0] as mysql.RowDataPacket).ramp_up,
      ResponsiveMaintainer: (result[0] as mysql.RowDataPacket).responsive_maintainer,
      LicenseScore: (result[0] as mysql.RowDataPacket).license_score,
      GoodPinningPractice: (result[0] as mysql.RowDataPacket).good_pinning_practice,
      PullRequest: (result[0] as mysql.RowDataPacket).pull_request,
      NetScore: (result[0] as mysql.RowDataPacket).net_score
    };

    return metrics;
  }

  public async injestPackageRatings(packageID: Schemas.PackageID, metrics: Schemas.PackageRating): Promise<boolean> {
    const sql = "UPDATE packages SET bus_factor = ?, correctness = ?, ramp_up = ?, responsive_maintainer = ?, license_score = ?, good_pinning_practice = ?, pull_request = ?, net_score = ? WHERE package_id = ?";
    const values = [metrics.BusFactor, metrics.Correctness, metrics.RampUp, metrics.ResponsiveMaintainer, metrics.LicenseScore, metrics.GoodPinningPractice, metrics.PullRequest, metrics.NetScore, packageID]; 
    const result : QueryResult | null | number = await this.query(sql, values);
    if (result == null || (result as mysql.ResultSetHeader).affectedRows == 0 || typeof(result) == "number") {
      return false;
    }
    return true;
  }
  /**
   * Checks if a user is allowed to execute a given SQL query on the connected database.
   * @param userRoleId - The ID of the user trying to query the DB
   * @param queryType - The type of query wanted to execute ONLY ALLOWS ('SELECT', 'INSERT', 'UPDATE', 'DELETE')
   * @param query - The SQL query wanted to execute.
   * @returns A promise that resolves with the a boolean of access permission or false on error.
   */
  /*
  private async checkPermission(userRoleId: number, queryType: string, query: string): Promise<boolean> {
    const sql = 'SELECT COUNT(*) as count FROM permissions WHERE role_id = ? AND (query_type = ? OR (query_type IS NULL AND query = ?))';
    const values = [userRoleId, queryType, query];
    const result : QueryResult | null | number = await this.query(sql, values);
    if (const const result == null || !Array.isArray(result) || result.length === 0 || typeof(result) == number || typeof(result) == number) {
      return false;
    }
    // Query the permissions table to check if the role has permission for the given query type and/or specific query
    return (result as any)[0].count > 0;
  }*/

  /**
   * Authenticates a user with the given username and password.
   * @returns A promise that resolves with the user's permission if the user is authenticated, null otherwise.
   public async authenticateUser(username: string, password: string): Promise<string | null> {
    const sql = 'SELECT user_type FROM users WHERE username = ? AND password = ?';
    const values = [username, password];
    const result : QueryResult | null | number = await this.query(sql, values);
    if (const result == null || !Array.isArray(result) || result.length === 0 || typeof(result) == number) {
      return null;
    }
    return (result[0] as mysql.RowDataPacket).user_type;
  }
   */
  

  /**
   * Executes a SQL query on the connected database.
   * @param sql - The SQL query to execute.
   * @param values - An array of values to replace placeholders in the SQL query.
   * @returns A promise that resolves with the query results or null on error.
   */
  async query(sql: string, values: any[] = []) : Promise<QueryResult | null | number> {
    if (!this.connection) {
      logger.error('Database connection not established.'); // replace with logger when we gain access to it
      return null;
    }

    try {

      const queryWords = sql.split(' ');
      const queryTypeToCheck = queryWords[0].toUpperCase();

      const [rows, fields] = await this.connection.execute(sql, values);
      return rows;
      
    } catch (error: any) {
      logger.error('Database query error:' + error); // replace with logger when we gain access to it

      if(error.code == "ER_DUP_ENTRY"){
        return -1;
      }
      return null;
    }
  }

  // creating methods to for testing purposes to allow mocking, 
  // will be overwritten by actual implementations in the future
  /*async injestPackage(packageData: Schemas.Package, readeMe: string): Promise<number> {
    return 0;
  }
  async injestPackageRatings(packageRating: Schemas.PackageRating, packageID: Schemas.PackageID): Promise<boolean> {
    return false;
  }
  async getPackageMetadata(name: Schemas.PackageName, version: Schemas.PackageVersion): Promise<Schemas.PackageMetadata[]> {
    return [];
  }
  async resetRegistry(user: Schemas.User): Promise<boolean> {
    return false;
  }
  async getPackageById(id: Schemas.PackageID): Promise<Schemas.Package | null> {
    return null;
  }
  async updatePackageById(id: Schemas.PackageID, packageData: Schemas.Package): Promise<boolean> {
    return false;
  }
  async deletePackageById(id: Schemas.PackageID): Promise<boolean> {
    return false;
  }
  async getPackageRatings(id: Schemas.PackageID): Promise<Schemas.PackageRating | null> {
    return null;
  }
  async deletePackageByName(name: Schemas.PackageName): Promise<boolean> {
    return false;
  }
  async searchPackagesByRegex(regex: Schemas.PackageRegEx): Promise<Schemas.PackageMetadata[]> {
    return [];
  }

  /**
   * Closes the connection to the MySQL database.
   */
  async close() {
    if (this.connection) {
      await this.connection.end();
      logger.info('Database connection closed.'); // replace with logger when we gain access to it
    }
  }
}

export default new DBCommunicator();


// EXAMPLE USAGES:
/* Select Data from a Table
    const sql = 'SELECT * FROM your_table';
    const results = await db.query(sql);
    console.log('Query results:', results); 
   */
/* Insert Data into a Table
    const insertSql = 'INSERT INTO your_table (column1, column2) VALUES (?, ?)';
    const values = ['value1', 'value2'];
    const insertResult = await db.query(insertSql, values);
    console.log('Insert result:', insertResult);
   */
/* Update Data in a Table 
    const updateSql = 'UPDATE your_table SET column1 = ? WHERE column2 = ?';
    const values = ['new_value', 'target_value'];
    const updateResult = await db.query(updateSql, values);
    console.log('Update result:', updateResult);
   */
/* Delete Data from a Table
    const deleteSql = 'DELETE FROM your_table WHERE column = ?';
    const value = 'value_to_delete';
    const deleteResult = await db.query(deleteSql, [value]);
    console.log('Delete result:', deleteResult);
   */
/* Execute Custom Queries
    const customSql = 'SELECT column1, column2 FROM your_table WHERE column3 = ? ORDER BY column4 DESC LIMIT 10';
    const values = ['filter_value'];
    const customQueryResult = await db.query(customSql, values);
    console.log('Custom query result:', customQueryResult);
   */
