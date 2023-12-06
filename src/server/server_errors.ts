/* 
 * ALL SERVER RELATED ERRORS BY CODE
 * 400: Bad Request, missing field, improper format, invalid authentication token
 * 401: Unauthorized permission, or username/password is invalid
 * 404: Not Found, ie package does not exist
 * 409: Conflict, ie package already exists
 * 413: Payload Too Large, ie too many packages returned
 * 424: Failed Dependency, ie package is not uploaded due to the disqualified rating.
 * 500: Internal Server Error, ex database error
 * 501: Not Implemented, ie API endpoint not implemented
 */
const DEFAULT_SERVER_ERRORS: { [key: number]: string } = { 
    400: "Bad Request",
    401: "Unauthorized",
    404: "Not Found",
    409: "Conflict",
    413: "Payload Too Large",
    424: "Failed Dependency",
    500: "Internal Server Error",
    501: "Not Implemented"
}

export class Server_Error extends Error { 
    num: number;
    which: number;
    endpoint: string;

    constructor(num:number, which:number, endpoint:string, str:string|null) {
        let message = str!=null ? str : 
                      num in DEFAULT_SERVER_ERRORS ? DEFAULT_SERVER_ERRORS[num] :
                        "Unknown Server Error or Default Error not Found";
        
        super(message);
        this.name = num.toString();
        this.num = num
        this.which = which;
        this.endpoint = endpoint;

        Object.setPrototypeOf(this, Server_Error.prototype);
    }

}

export class AggregateError extends Error {
    errors: Error[];
    num: number = 500;
    which: number = 0;
    endpoint: string = '';
    
    constructor(errors: Error[]) {
        super('Multiple errors occurred');
        this.name = 'AggregateError';
        this.errors = errors;
        if(errors[0] instanceof Server_Error) {
            this.num = errors[0].num;
            this.which = errors[0].which;
            this.endpoint = errors[0].endpoint;
        }
        Object.setPrototypeOf(this, AggregateError.prototype);

    }
}
