const express = require('express');
const { paths: { routerHandlers, assets } } = global.appNamespace.utils;

const headers = require('./middlewares/headers');

exports.commonMiddlewares = [express.static(assets())];

exports.routes = {
    post: {
        "/api/url-shortener": {
            handler: routerHandlers('url-shortener'),
            middlewares: [express.json(), headers("application/json")]
        }
    },
    get: {
        "/SU:sequence": routerHandlers('redirector')
    }
};
