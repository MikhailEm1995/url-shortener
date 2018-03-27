const { routes, commonMiddlewares } = require('./routes');

module.exports = function(express) {
    const router = express.Router();

    commonMiddlewares.forEach(middleware => router.use(middleware));

    Object.keys(routes).forEach((method) => {
        Object.keys(routes[method]).forEach((query) => {
            if (!router[method]) return;
            
            const route = routes[method][query];

            if (route.handler && route.middlewares) {
                if (route.handler && route.middlewares instanceof Array) {
                    router[method](query, route.middlewares, require(route.handler));
                }
            } else if (route.handler) {
                router[method](query, require(route.handler))
            } else {
                router[method](query, require(route));
            }
        });
    });

    return router;
};
