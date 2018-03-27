module.exports = (contentType) => (req, res, next) => {
    res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST",
        "Access-Control-Allow-Headers": "Content-Type, Accept",
        "Access-Control-Request-Headers": "Content-Type, Accept",
        "Content-Type": contentType
    });
    next();
};
