require('./utils/dirs');

const { paths: { processes } } = global.appNamespace.utils;

const childProcess = require('child_process');

const urlShortenerProcess = childProcess.fork(processes('url-shortener'));
const redirectorProcess = childProcess.fork(processes('redirector'));

if (!global.appNamespace) global.appNamespace = {};
if (!global.appNamespace.processes) global.appNamespace.processes = {};

global.appNamespace.processes.urlShortenerProcess = urlShortenerProcess;
global.appNamespace.processes.redirectorProcess = redirectorProcess;
