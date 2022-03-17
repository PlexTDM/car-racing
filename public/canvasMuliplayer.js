const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const moveBtn = document.getElementById('move');
const moveBtn1 = document.getElementById('move1');
const moveBtn2 = document.getElementById('move2');
const width = canvas.width;
const height = canvas.height;
let alerting = false;
ctx.fillStyle = '#000';

const socket = io();

let players = [
    player1 = {
        x: 0,
        score: 0,
        name: 'baldan',
        key: 'KeyA',
        path: 0
    },
    player2 = {
        x: 0,
        score: 0,
        name: 'gey',
        key: 'Space',
        path: 0
    },
    player3 = {
        x: 0,
        score: 0,
        name: 'shees',
        key: 'KeyL',
        path: 0
    }
]

socket.on('move', (player,x) => {
    players[player].x = x;
})

let img = new Image;
img.src = 'http://localhost:3000/static/car.png';
let gif = new Image;
gif.src = 'http://localhost:3000/static/giphy.gif';

const restart = () => {
    players.map((player) => {
        player.x = 0;
        player.path = 0;
    })
    alerting = false;
    window.requestAnimationFrame(refresh);
}

const showAlert = (player) => {
    if (!player) return;
    alerting = true;
    swal.fire({
        title: player.name + ' yallaa',
        text: 'onoo: ' + player.score,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Retry',
    }).then(() => {
        restart();
    }
    )
}

const checkPlayerWin = player => {
    if (player.x >= goal) {
        player.score++;
        ctx.drawImage(gif, goal, 15, 50, 50);
        showAlert(player);
    }
}

const speed = 15;
const goal = 450;
const refresh = () => {
    if (alerting) return;
    ctx.clearRect(0, 0, width, height)
    ctx.fillRect(450, 0, 10, height);
    players.forEach((player, index) => {
        checkPlayerWin(player)
        ctx.drawImage(img, player.x, 80 * index, 50, 50)
        for (let i = player.path; i > 0; i--) {
            player.x += 0.1;
            player.path -= 0.1;
            socket.emit("move", index,player.x);
        }
    })
    window.requestAnimationFrame(refresh)
}
players.forEach((player) => {
    window.addEventListener("keyup", (e) => {
        if (e.code === player.key) {
            player.path += speed;
        }
    });
})
window.requestAnimationFrame(refresh);
