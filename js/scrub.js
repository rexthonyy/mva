window.onload = () => {
    let scrubInput = document.getElementById("scrubInput");
    let scrubBtn = document.getElementById("scrubBtn");
    let outputInput = document.getElementById("outputInput");
    let copyBtn = document.getElementById("copyBtn");

    scrubBtn.onclick = () => {
        if (scrubInput.value.trim().length == 0) {
            return alert("Input is empty");
        }
        let inputString = scrubInput.value;
        outputInput.value = processInput(inputString);
    };

    copyBtn.onclick = () => {
        let outputString = outputInput.value;
        copyToClipboard(outputString);
        outputInput.select();
        outputInput.setSelectionRange(0, outputString.length);
    };
};

function processInput(rawHistoricalData) {
    /* rawHistoricalData
    ...
    2008-10-21 11:00:00\t1.31012\t1.31276\t1.30867\t1.31009\t34275\t16\n // <--- Note that the space, tab and newline
    2008-10-21 12:00:00	1.30997	1.31076	1.30782	1.3092	23096	22\n
    ...
    */

    let rows = rawHistoricalData.split("\n");
    let arr = [];

    rows.forEach(row => {
        let col11 = row.split(" ");
        let dateString = col11[0];
        let col12 = col11[1].split("\t");
        let high = col12[2];
        let low = col12[3];
        arr.push([dateString, high, low]);
    });

    /* arr
    [ 
        [2008-01-01, 1.31276, 1.30867], // 00:00
        [2008-01-01, 1.31076, 1.30782], // 01:00
        ...
        [2008-01-02, 1.31276, 1.30867], // 00:00
        [2008-01-02, 1.31076, 1.30782], // 01:00
        ...
    ]
    */

    let jsonDateSorted = {};

    arr.forEach(row => {
        if (jsonDateSorted[row[0]] == undefined) {
            jsonDateSorted[row[0]] = [];
        }

        jsonDateSorted[row[0]].push(row[1] - row[2]); // high - row
    });

    /* jsonDateSorted
    [ 
        2008-01-01: [0.002, 0.004,...],
        2008-01-02: [0.002, 0.004,...],
    ]
    */

    let jsonDateSortedRangeNormalized = {};

    for (const dateString in jsonDateSorted) {
        let dateArr = jsonDateSorted[dateString];
        let max = Math.max(...dateArr);
        jsonDateSortedRangeNormalized[dateString] = jsonDateSorted[dateString].map(val => val / max);

        let countElms = jsonDateSortedRangeNormalized[dateString].length;
        if (countElms < 24) {
            let remaining = 24 - countElms;
            for (let i = 0; i < remaining; i++) {
                jsonDateSortedRangeNormalized[dateString].push(0);
            }
            countElms = jsonDateSortedRangeNormalized[dateString].length;
        }
    }

    /* jsonDateSortedRangeNormalized
    [ 
        2008-01-01: [0.5, 1, 0.2,...],
        2008-01-02: [0.02, 0.3, 1,...,0,0,0],
    ]
    */

    return JSON.stringify(jsonDateSortedRangeNormalized);
}