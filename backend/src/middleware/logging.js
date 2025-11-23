export function requestLogger(req, res, next) {
    const date = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - date;
        console.log(`${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
    })
    console.log(req.method, req.url);
    next();
}