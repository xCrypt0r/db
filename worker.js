self.onmessage = function (e) {
    if (e.data.type === 'csv') {
        let data = e.data.content;

        self.postMessage({
            type: 'db',
            db: data.length,
        });
    }
};

function getFrequency(db, firstCharacter = true) {
    let result = {};

    for (let i = 0, len = db.length; i < len; i++) {
        let firstChar = db[i].word.at(firstCharacter ? 0 : -1);

        result[firstChar] = (result[firstChar] || 0) + 1;
    }

    return result;
}
