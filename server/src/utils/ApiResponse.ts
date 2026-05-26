export class ApiResponse<T = any> {
    success: boolean;
    data: T | null;
    message: string | null;

    constructor(success: boolean, data: T | null = null, message: string | null = null) {
        this.success = success;
        this.data = data;
        this.message = message;
    }

    static success<T>(data: T, message: string | null = "Operation Successful"): ApiResponse<T> {
        return new ApiResponse(true, data, message);
    }

    static error(message: string, data: any = null): ApiResponse<null> {
        return new ApiResponse<null>(false, data, message);
    }
}