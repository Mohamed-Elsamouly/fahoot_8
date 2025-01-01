window.InitUserScripts = function()
{
var player = GetPlayer();
var object = player.object;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
window.Script1 = function()
{
  console.log(io); // Ensure `io` is available (e.g., Socket.IO library is loaded)

// Initialize the socket connection
const socket = io('https://fahoot.glitch.me/');

// Get the player object
let player = GetPlayer();
let clicked = false; 
let join = false; // Initialize the join variable
// Select the button element
let btn = document.querySelector("[data-acc-text='btn']");

// Add event listeners for both click and touchend events
btn.addEventListener("click", sendName);
btn.addEventListener("touchend", sendName);

// Function to send the player's name
function sendName() {
    if (join) { // Check if join is true
        clicked = true;
        let name = player.GetVar("name"); // Get the player's name
        if (name !== '') { // Check if the name is not empty
            socket.emit("find", { name: name }); // Emit the "find" event with the name
        }
    }
}

// Listen for the "find" event from the server
socket.on("updateJoinStatus", function(data) {
    join = data.join; // Update the join variable based on server data
});
	
socket.on("find", (e) => {
    player.SetVar("connected", e.connected); // Update the player's "connected" variable
    player.SetVar("ID", e.sessionId);
});

}

window.Script2 = function()
{
  let player = GetPlayer(); 
let question_no = player.GetVar("question_no") - 1; 

const quizQuestions = [
  {
    question: "What is the largest planet in our solar system?",
    options: ["Jupiter", "Mars", "Earth", "Saturn"],
    correctAnswer: "Jupiter"
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Claude Monet"],
    correctAnswer: "Leonardo da Vinci"
  },
  {
    question: "Which language has the most native speakers in the world?",
    options: ["English", "Spanish", "Mandarin Chinese", "Hindi"],
    correctAnswer: "Mandarin Chinese"
  },
  {
    question: "What is the capital city of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
    correctAnswer: "Canberra"
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Oxygen", "Osmium", "Oxide"],
    correctAnswer: "Oxygen"
  },
  {
    question: "Which country is known as the Land of the Rising Sun?",
    options: ["China", "India", "Japan", "South Korea"],
    correctAnswer: "Japan"
  },
  {
    question: "Who wrote the play 'Romeo and Juliet'?",
    options: ["William Shakespeare", "Charles Dickens", "Jane Austen", "George Orwell"],
    correctAnswer: "William Shakespeare"
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: "Pacific Ocean"
  },
  {
    question: "Which famous scientist developed the theory of relativity?",
    options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Nikola Tesla"],
    correctAnswer: "Albert Einstein"
  },
  {
    question: "What is the smallest country in the world by land area?",
    options: ["Monaco", "Vatican City", "Nauru", "San Marino"],
    correctAnswer: "Vatican City"
  }
];


player.SetVar("question", quizQuestions[question_no].question); 
player.SetVar("option_1", quizQuestions[question_no].options[0]); 
player.SetVar("option_2", quizQuestions[question_no].options[1]); 
player.SetVar("option_3", quizQuestions[question_no].options[2]); 
player.SetVar("option_4", quizQuestions[question_no].options[3]); 
player.SetVar("correct_answer", quizQuestions[question_no].correctAnswer); 


}

window.Script3 = function()
{
  const socket = io('https://fahoot.glitch.me/'); 

let player = GetPlayer(); 
let name = player.GetVar("name"); 
let score = player.GetVar("score");

socket.emit("getScore", {name: name, score: score});

socket.on("getScore", (e) => {
    // Assuming 'player' is already defined and accessible
    if (e.length >= 4) { // Ensure there are at least 4 players
        player.SetVar("player_1", e[0].name);
        player.SetVar("player1_score", e[0].score);

        player.SetVar("player_2", e[1].name);
        player.SetVar("player2_score", e[1].score);

        player.SetVar("player_3", e[2].name);
        player.SetVar("player3_score", e[2].score);

        player.SetVar("player_4", e[3].name);
        player.SetVar("player4_score", e[3].score);
        
        player.SetVar("getScore", true);
    } else {
        console.error("Not enough players in the data received:", e);
    }
});

}

window.Script4 = function()
{
  let red = document.querySelector("[data-acc-text='red']");
let yellow = document.querySelector("[data-acc-text='yellow']");
let blue = document.querySelector("[data-acc-text='blue']");
let green = document.querySelector("[data-acc-text='green']");

let player = GetPlayer(); 

let score_1 = player.GetVar("player1_score"); 
let score_2 = player.GetVar("player2_score"); 
let score_3 = player.GetVar("player3_score"); 
let score_4 = player.GetVar("player4_score"); 

let rectangles = [red, yellow, blue, green];
let scores = [score_1, score_2, score_3, score_4];

// Animate each rectangle
rectangles.forEach((rect, index) => {
    // Get the height of the rectangle using getBoundingClientRect
    let rectHeight = rect.getBoundingClientRect().height;

    // Calculate the move distance (percentage of the height based on score)
    let moveDistance = (scores[index] / 100) * rectHeight;

    // Animate using GSAP
    gsap.to(rect, {
        duration: 1, // Animation duration in seconds
        y: `-=${moveDistance}`, // Move up by the calculated distance from its current position
        ease: "power2.out" // Easing function
    });
});
}

};
