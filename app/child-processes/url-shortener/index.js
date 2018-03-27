console.log('*** url-shortener process started ***');

const { paths: { modules, constants } } = require('../../utils/dirs');
const { ip, port } = require(constants('localhost'));
const { host, user, password, urlShortenerDB } = require(constants('db'));

const UrlShortener = require(modules('UrlShortener'));
const shortener = new UrlShortener();

const MySQL = require(modules('MySQL'));
const db = new MySQL();

process.on('message', (message) => {
    let { id, url } = message;

    if (url.slice(0, 4) !== 'http') url = 'http://' + url;

    if (!shortener.validateUrl(url)) {
        process.send({ id, type: 'error', data: 'Invalid url' });
        return;
    }

    const sequence = shortener.generateSequence();

    db.connectDB(host, user, password, urlShortenerDB);
    db.insertInto(urlShortenerDB, 'urls', {
        'original_url': url,
        'alias':  sequence
    })
        .then(() => {
            process.send({ id, type: 'success', data: ip + ':' + port + '/SU' + sequence });
        })
        .catch((err) => {
            process.send({ id, type: 'error', data: 'Could\'t put new record' });
            console.log(err);
        });
});
