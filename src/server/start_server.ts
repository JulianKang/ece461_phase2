import { PackageManagementAPI } from './server'; 
import logger from '../logger';

const port = 3000
const apiServer = new PackageManagementAPI();
logger.info(`Starting server on port ${port}`);
apiServer.start(port);

