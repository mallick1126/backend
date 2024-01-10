/* The ApiResponse class is used to create objects that represent the response of an API request,
including the status code, data, message, and success status. */

class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
