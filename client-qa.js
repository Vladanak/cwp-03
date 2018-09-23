const net = require("net");
const fs = require("fs");
const port = 8124;

const clientQa = new net.Socket();

let QA;
let ans;
let curQA = 0;

clientQa.setEncoding('utf8');

clientQa.connect(port, function() {
    console.log('Connected');
    clientQa.write(process.argv[2]);
});

clientQa.on('data', function(data) {
    if (data == "ACK") {
        fs.readFile("qa.json", (err, data) => {
            if (err) {
                console.log("Error read qa.json");
                clientQa.destroy();
            } else {
                QA = JSON.parse(data);
                QA = shuffle(QA);
                sendQA()
            }
        });
    } else if (data === "DEC") {
        clientQa.destroy();
    } else {
        ans = parseInt(data);
        console.log("Quastion - " + QA[curQA - 1].qs + " server answer " + QA[curQA - 1].ans[ans]);
        console.log("Answer " + QA[curQA - 1].ans[0]);
        sendQA();

    }
    //clientQa.destroy();
});

clientQa.on('close', function() {
    console.log('Connection closed');
});

function sendQA() {
    if (curQA < QA.length) {
        clientQa.write(QA[curQA++].qs);
    } else {
        clientQa.destroy();
    }
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let rann = getRandomInt(0, i);
        console.log(rann);
        t = arr[rann];
        arr[rann] = arr[i];
        arr[i] = t;
    }
    return arr;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}