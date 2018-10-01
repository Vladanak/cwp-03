const net = require("net");
const fs = require("fs");
const port = 8124;
let seed = 0;

let QA;
let ans;
const server = net.createServer((client) => {
    console.log("Client connected");
    client.setEncoding("utf8");
    client.id = seed++;
    let log = client.id + ".txt";
    client.on("data", (data) => {
        if (data === 'QA') {
            fs.readFile("qa.json", (err, data) => {
                if (err) {
                    console.log("Error read qa.json");
                    client.destroy();
                } else {
                    QA = JSON.parse(data);
                    fs.appendFile(log, "Connected new client: ID - " + client.id + "\n", (err) => {
                        if (err) {
                            console.log("Error append in file");
                        }
                    });
                    client.write("ACK");
                }
            });
        } else {
            //client.write("DEC");
            console.log(client.id + " data: " + data);
            ans = getRandomAnswer();
            client.write(ans);
            fs.appendFile(log, "New QA - " + data + "\nServer answer - " + ans + "\n", (err) => {
                if (err) {
                    console.log("Error append in file");
                }
            });
            //console.log("Server answer " + ans);
        }
        //client.write("Hello from server");
    });

    client.on("end", () => {
        console.log("client disconected");
    });
});

server.listen(port, () => {
    console.log("listenning");
});


function getRandomAnswer() {
    return Math.random() > 0.5 ? '1' : '0';
}