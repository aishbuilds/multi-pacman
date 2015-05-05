# Multiplayer Pacman game

Two player pacman game: Pacman and Ghost.
Built using Javascript, node.js and socket.io

Live demo - https://murmuring-cove-2777.herokuapp.com/

## Installation

- Install [node.js](https://nodejs.org/)

## How to use

```
$ cd multi-pacman
$ npm install
$ node index.js
```

## How to play

- Ensure 2 devices on a newtwork.
- Open browser in Player 1 to http://your.ip.address:3000/
- Click Create, browser opens screen to display the game id
- Open Player 2 browser to http://your.ip.address:3000/
- Click Join
- Enter the game id displayed in Player 1 screen
- Player 1 is the Pacman, and Player 2 is the ghost.
- If the Pacman eats all the dots before the ghost captures him, he wins. Otherwise, if the ghost capturs the pacman, he wins.
