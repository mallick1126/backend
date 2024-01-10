/**
 * The asyncHandler function is a higher-order function that wraps an asynchronous request handler and
 * catches any errors that occur during its execution.
 * @param requestHandler - The requestHandler is a function that handles the incoming request and
 * generates a response. It takes three parameters: req (the request object), res (the response
 * object), and next (a function to pass control to the next middleware function).
 */
const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

// another way to do it is to use async await try catch method

/*
const   asyncHandler = (fn)= async(req, res, next)=>{
    try {
        await fn(req, res, next)
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}
*/
