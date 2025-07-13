const input = document.getElementById('consoleInput');
const output = document.getElementById('output');

let gameState = "waiting";

function printLine(text) {
  output.innerHTML = '';
  const line = document.createElement('div');
  line.className = 'line';
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

async function postRequest(url, data) {
  res = await fetch(url, {method: 'POST', body: JSON.stringify(data), headers: {'Content-Type': 'application/json'}});
  data = res.json().then(data => {
    if (data.message && data.state) {
      return data;
    } else {
      printLine("No message received from server.");
      return null
    }
  }).catch(error => {
    console.error('Error:', error);
    printLine("An error occurred while communicating with the server.");
    return null
  });
  return data;
}

async function handleCommand(command) {
  const lower = command.toLowerCase();

  if (lower === 'start' && gameState === "waiting"){
    gameState = "first_choice";
    printLine("Game started!\nYou are in a dark forest. What do you do?\n- Go north\n- Go south\n- Stay still");
    // secret choice fly up
  } 
  else if (gameState === "first_choice" || gameState === "flag") {
    const data = await postRequest('/', {command: lower, state: gameState});
    if (data) {
      printLine(data.message);
      gameState = data.state;
    } else {
      printLine("No response from server.");
      gameState = "waiting";
    }
  } 
  else {
    printLine("Invalid command or game not started. Type 'start' to begin.");
    gameState = "waiting";
  }
}

input.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    const command = input.value.trim();
    if (command) {
      handleCommand(command);
    }
    input.value = '';
  }
});

printLine("Welcome! Type 'start' to begin the game.");