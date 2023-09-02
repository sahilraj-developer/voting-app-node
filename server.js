const express = require("express");
const app = express();
 require('dotenv').config();
const port = process.env.PORT;

const helmet = require("helmet");


app.use(express.static("client"));
const server = app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
const io = require("socket.io")(server);



const cspOptions = {
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
    },
};

app.use(helmet.contentSecurityPolicy(cspOptions));


const candidates = {
    "0": { votes: 0, label: "JavaScript", color: randomRGB() },
    "1": { votes: 0, label: "C#", color: randomRGB() },
    "2": { votes: 0, label: "PHP", color: randomRGB() },
    "3": { votes: 0, label: "Python", color: randomRGB() },
    "4": { votes: 0, label: "Go", color: randomRGB() }
};

io.on("connection", (socket) => {
    io.emit("update", candidates);

    // On new vote
    socket.on("vote", (index) => {

        // Increase the vote at index
        if (candidates[index]) {
            candidates[index].votes += 1;
        }

        // Show the candidates in the console for testing
        console.log(candidates);

        // Tell everybody else about the new vote
        io.emit("update", candidates);
    });
});

function randomRGB() {
    const r = () => Math.random() * 256 >> 0;
    return `rgb(${r()}, ${r()}, ${r()})`;
}