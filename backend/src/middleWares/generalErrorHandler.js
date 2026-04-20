const generalErrorHandler = (err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = err.message || "Something went wrong";
     console.error("ERROR 💥:", err); // 👈 VERY IMPORTANT

    res.status(status).json({
        success: false,
       message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
};

export default generalErrorHandler;

