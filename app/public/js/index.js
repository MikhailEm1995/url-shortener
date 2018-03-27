(function() {
    const INPUT_FIELD = document.querySelector('#input');
    const SUBMIT_BUTTON = document.querySelector('#input_submit');
    const OUTPUT = document.querySelector('#output');

    SUBMIT_BUTTON.addEventListener('click', () => {
        const INPUT_VALUE = INPUT_FIELD.value;
        const payload = JSON.stringify({ data: INPUT_VALUE });

        const headers = new Headers();
        headers.set('Content-Type', 'application/json;charset=UTF-8');
        headers.append('Accept', 'application/json');

        fetch('/api/url-shortener', {
            method: 'POST',
            mode: 'cors',
            headers: headers,
            body: payload,
            credentials: 'omit'
        })
            .then(res => res.json())
            .then((json) => {
                OUTPUT.innerHTML += json.data + '<br>';
            })
            .catch((err) => {
                OUTPUT.innerHTML += err;
            });
    });
}());
