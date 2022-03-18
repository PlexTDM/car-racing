const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const socket = io();
// const speed = 15;
// const goal = 450;
let speed;
let goal;
let step;
ctx.fillStyle = '#000';
let alerting = false;
let thisPlayer = {
    id: '',
    x: 0,
    score: 0,
    name: 'Tengis',
    key: 'Space',
    path: 0
}
let players = [];

window.addEventListener("keyup", (e) => {
    if (e.code === thisPlayer.key) {
        thisPlayer.path += speed;
    }
});

let img = new Image;
img.src = '/static/car.png';
let gif = new Image;
gif.src = '/static/giphy.gif';

const restart = () => {
    players.map(player => {
        player.x = 0;
        player.path = 0;
    })
    alerting = false;
    window.requestAnimationFrame(refresh);
}

const showAlert = player => {
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

const refresh = () => {
    if (alerting) return;
    ctx.clearRect(0, 0, width, height)
    ctx.fillRect(450, 0, 10, height);
    players.forEach((player, index) => {
        checkPlayerWin(player)
        ctx.drawImage(img, player.x, 80 * index, 50, 50);
        ctx.fillText(player.name, player.x, (80 * index) + 10);
        if(player.id !== thisPlayer.id) return
        for (let i = thisPlayer.path; i > 0; i--) {
            player.x += 0.2;
            thisPlayer.path -= 0.2;
            socket.emit("move", thisPlayer.id, player.x);
        }
    })
    window.requestAnimationFrame(refresh)
}

socket.on('connect', () => {
    thisPlayer.name = 'tengis';
    thisPlayer.id = socket.id;
    socket.emit('add', thisPlayer);
    players.push(thisPlayer);
});

socket.on("init", (sp, g, st) => {
    speed = sp;
    goal = g;
    step = st;
})

socket.on('newPlayer', (pl) => {
    players = pl
})


socket.on('move', (id, x) => {
    players.map((player) => {
        if (player.id === id) player.x = x;
    })
})

window.requestAnimationFrame(refresh);
