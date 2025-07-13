const express = require('express');
const cors = require('cors');
const app = express();
const path = require("path");
require("dotenv").config()

// Allow all CORS requests
app.use(cors());

// Serve static files from 'public' folder (or your folder)
app.use(express.static(path.join(__dirname, 'public')));

// Optional: serve index.html on root

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/', (req, res) => {
  const { command, state } = req.body;
  const lower = command.toLowerCase();
  let message = "Invalid command.";
  let newState = state;
  if (state === "first_choice") {
    if (lower === "go north") {
      message = "You go north and got killed by a barbarian. Game over!\nType 'start' to play again.";
      newState = "waiting";
    } else if (lower === "go south") {
      message = "You go south and fall into a pit. Game over!\nType 'start' to play again.";
      newState = "waiting";
    } else if (lower === "stay still") {
      message = "You wait and a bear shows up. Game over!\nType 'start' to play again.";
      newState = "waiting";
    } else if (lower === "fly up") {
      message = "You suddenly lift off the ground... ascending...\nSay the magic word...";
      newState = "flag";
    } else {
      message = "Invalid choice. Try: 'Go north', 'Go south', or 'Stay still'.";
    }
  } else if (state === "flag") {
    if (lower === "flag") {
      message = `${process.env.GZCTF_FLAG}\nType 'start' to play again.`;
      newState = "waiting";
    } else {
      message = "Wrong word... try again?\nType 'start' to play again.";
      newState = "waiting";
    }
  } else {
    message = "Game state invalid or not started.";
  }

  res.json({ message, state: newState });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
