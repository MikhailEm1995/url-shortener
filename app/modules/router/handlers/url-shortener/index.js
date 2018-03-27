const { urlShortenerProcess } = global.appNamespace.processes;

const queue = new Map();

urlShortenerProcess.on('message', (message) => {
    queue.get(message.id)(message);
    queue.delete(message.id);
});

module.exports = (req, res) => {
    const url = req.body.data;
    
    const resID  = Date.now();

    if (!url) {
        res.status(400).send('No url were provided');
        return;
    }

    queue.set(resID, (payload) => {
        switch (payload.type) {
            case 'error': {
                res.status(400).send(payload.data);
                return;
            }
            case 'success': {
                res.status(200).send(JSON.stringify({ data: payload.data }));
                return;
            }
            default: {
                res.status(500).send('Couldn\'t write new record to database');
            }
        }
    });

    urlShortenerProcess.send({ id: resID, url });
};
