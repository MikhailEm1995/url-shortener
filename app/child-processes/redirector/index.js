console.log('*** redirector process started ***');

const { paths: { modules, constants } } = require('../../utils/dirs');
const { host, user, password, urlShortenerDB } = require(constants('db'));

const MySQL = require(modules('MySQL'));
const db = new MySQL();

process.on('message', (message) => {
    const { id, sequence } = message;
    
    db.connectDB(host, user, password, urlShortenerDB);
    db.selectFrom(urlShortenerDB, 'urls', ['original_url'], {
        and: { 'alias': [sequence] }
    })
        .then((result) => {
            process.send({ id, type: 'success', data: result });
        })
        .catch((err) => {
            process.send({ id, type: 'error', data: 'Couldn\'t get requested url' })
            console.log(err);
        });
});
