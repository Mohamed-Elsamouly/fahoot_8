const express = require('express');
const app = express();

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Start the Express server
/*const expressServer = app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
*/
const expressServer = app.listen(process.env.PORT || 4000, () => {
    console.log(`Server is running on port ${process.env.PORT || 4000}`);
});


// Import and initialize Socket.IO with the Express server
const socketio = require('socket.io');
const io = socketio(expressServer);

let players = []; // This will store both player names and their scores
let playersScore = []; 
let disconnectedPlayersCount = 0; // Counter to track disconnected players

// Socket.IO logic
io.on('connection', (socket) => {
    // Listen for "find" event (player name submission)
    socket.on("find", (e) => {
        // Store player name and initialize their score to 0
        players.push({ name: e.name, socketId: socket.id });

        if (players.length === 4) {
            // Emit data when 4 players are connected
            io.emit("find", { connected: true });
            console.log("Players connected:", players.map(player => player.name));
        }
    });

    // Listen for "getScore" event (player score submission)
    socket.on("getScore", (e) => {
        // Find the player by name and update their score
        playersScore.push(e);

        if (playersScore.length === 4) {
            // Emit player scores when all 4 players' scores are collected
            io.emit("getScore", playersScore.map(player => ({ name: player.name, score: player.score })));
            console.log("Scores sent:", playersScore);
            players = []; // Reset the players array after emitting the data
            playersScore = []; // Reset players array after emitting the data
            console.log(players);
            console.log(playersScore);
        }
    });

    // Handle player disconnection
    socket.on('disconnect', () => {
        const disconnectedPlayerIndex = players.findIndex(player => player.socketId === socket.id);

        if (disconnectedPlayerIndex !== -1) {
            if (players.length < 4) {
                // Remove the player from the players array if the number of players is less than 4
                players.splice(disconnectedPlayerIndex, 1);
                console.log(`Player disconnected before 4 players were connected. Removed from the array.`);
            } else {
                // Set the player's score to zero if the number of players is 4 or more
                const disconnectedPlayer = players[disconnectedPlayerIndex];
                playersScore.push({ name: disconnectedPlayer.name, score: 0 });
                disconnectedPlayersCount++;
                console.log(`Player disconnected after 4 players were connected. Score set to zero.`);
            }
        }
        if (disconnectedPlayersCount === 4){
            players = [];
            playersScore = [];
            disconnectedPlayersCount = 0; // Reset the counter
            console.log("All 4 players disconnected. Resetting players and playersScore arrays.");
        }
    });
});
