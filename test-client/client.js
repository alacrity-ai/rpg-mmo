const readline = require('readline');
const io = require('socket.io-client');
const socket = io('http://localhost:3000');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'MUD> '
});

socket.on('connect', () => {
  console.log('Connected to MUD server!');
  rl.prompt();
});

socket.on('message', (msg) => {
  console.log(msg);
  rl.prompt();
});

rl.on('line', (line) => {
  const input = line.trim();
  
  // Send the whole input line as a single string
  socket.emit('command', input); 

  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});
