const path = require('path');
const DIR = path.resolve(__dirname, '..');

const _this = this;

const root = path.resolve.bind(_this, DIR);

if (!global.appNamespace) global.appNamespace = {};

if (!global.appNamespace.utils) global.appNamespace.utils = {};

global.appNamespace.utils.root = root;
global.appNamespace.utils.paths = {
    root,
    modules: path.resolve.bind(_this, root('modules')),
    processes: path.resolve.bind(_this, root('child-processes')),
    routerHandlers: path.resolve.bind(_this, root('modules/router/handlers')),
    constants: path.resolve.bind(_this, root('constants')),
    assets: path.resolve.bind(_this, root('public'))
};

exports.root = root;
exports.paths = global.appNamespace.utils.paths;
