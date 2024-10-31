function getRandom(min, max) {
    return myMap(Math.random(), 0, 1, min, max);
}

function myMap(val, minF, maxF, minT, maxT) {
    return minT + (((val - minF) / (maxF - minF)) * (maxT - minT));
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function stopClickPropagation(e) {
    if (!e) e = window.event;
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
}

function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

function getMonthWeekNumber(date) {
    const dayOfMonth = date.getDate();
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const startDayOfWeek = startOfMonth.getDay();
    return Math.floor((dayOfMonth + startDayOfWeek - 1) / 7);
}

function getDateInput(date) {
    let dayOfWeek = date.getDay(); // 0 - 6
    let dayOfMonth = date.getDate(); // 1 - 31
    let week = getMonthWeekNumber(date); // 0 - 4
    let month = date.getMonth(); // 0 - 11
    return [dayOfWeek / 6, dayOfMonth / 31, week / 4, month / 11];
}