const { redirectorProcess } = global.appNamespace.processes;

const queue = new Map();

redirectorProcess.on('message', (message) => {
    queue.get(message.id)(message);
    queue.delete(message.id);
});

module.exports = (req, res) => {
    const { sequence } = req.params;

    const resID = Date.now();

    queue.set(resID, (payload) => {
        switch (true) {
            case payload.type === 'error': {
                res.status(500).send('Couldn\'t get requested url');
                return;
            }
            case payload.type === 'success' && payload.data instanceof Array: {
                res.redirect(payload.data[0]['original_url']);
                return;
            }
            case payload.type === 'success' && !(payload.data instanceof Array): {
                res.send(400).send('No one url matches your request');
                return;
            }
            default: {
                res.status(500).send('Couldn\'t get requested url');
            }
        }
    });

    redirectorProcess.send({ id: resID, sequence });
};