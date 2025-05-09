importScripts(
    'https://cdn.jsdelivr.net/npm/fflate@0.8.0/umd/index.js',
    'https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js'
);

self.onmessage = function (e) {
    if (e.data.type === 'start') {
        fetch('https://xcrypt0r.github.io/db/db.csv.gz')
            .then((res) => res.arrayBuffer())
            .then((compressedBuffer) => {
                // GZIP 압축 해제
                const decompressed = fflate.decompressSync(new Uint8Array(compressedBuffer));
                const csvText = new TextDecoder('utf-8').decode(decompressed);

                // PapaParse로 CSV 파싱
                const db = [];

                Papa.parse(csvText, {
                    skipEmptyLines: true,
                    step: function (results) {
                        const record = results.data;
                        if (record[5] !== 'O') return;

                        const word = record[0];
                        db.push({
                            word,
                            species: record[1].split('|'),
                            parts: record[2].split('|'),
                            categories: record[3].split('|'),
                            topics: record[4].split('|'),
                            firstCharacter: word[0],
                            lastCharacter: word[word.length - 1],
                            firstCharacterPhonemes: record[6],
                            allPhonemes: record[7],
                            lastCharacterPhonemes: record[8],
                        });
                    },
                    complete: function () {
                        self.postMessage({
                            type: 'db',
                            db,
                            firstCharacterfrequency: getFrequency(db, true),
                            lastCharacterfrequency: getFrequency(db, false),
                        });
                    },
                });
            })
            .catch((err) => {
                self.postMessage({ type: 'error', message: err.message });
            });
    }
};

function getFrequency(db, first = true) {
    const freq = {};
    for (let i = 0; i < db.length; i++) {
        const ch = db[i].word.at(first ? 0 : -1);
        freq[ch] = (freq[ch] || 0) + 1;
    }
    return freq;
}
