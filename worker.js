self.onmessage = function (e) {
    if (e.data.type === 'csv') {
        let data = e.data.content.split(/\r?\n/)
            .slice(1)
            .map((record) => record.split(','))
            .filter((record) => record[5] === 'O')
            .map((record) => ({
                word: record[0],
                species: record[1].split('|'),
                parts: record[2].split('|'),
                categories: record[3].split('|'),
                topics: record[4].split('|'),
                firstCharacter: record[0].at(0),
                lastCharacter: record[0].at(-1),
                firstCharacterPhonemes: record[6],
                allPhonemes: record[7],
                lastCharacterPhonemes: record[8],
            }));

        self.postMessage({
            type: 'db',
            db: data,
            firstCharacterfrequency: getFrequency(data, true),
            lastCharacterfrequency: getFrequency(data, false)
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
