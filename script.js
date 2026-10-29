const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let WIDTH
let HEIGHT

let size
let otstupX
let otstupY

let map = [];

let CirX
let CirY

let cols = 15
let rows = 15
let PANEL = 70
let timerId = null
let teleportChance = 0.3

let isReady = false

const inputW = document.querySelector("#inputW")
const inputH = document.querySelector("#inputH")
const inputT = document.querySelector("#inputT")
const btnGenerate = document.querySelector("#btnGenerate")
const btnFind = document.querySelector("#btnFind")
const btnSave = document.querySelector("#save")
const speedSelect = document.querySelector("#speedSelect")

let speed = 200

speedSelect.addEventListener("change", () =>{
    speed = +(speedSelect.value)
})

const resize = () =>{
    WIDTH = canvas.width = innerWidth;
    HEIGHT = canvas.height = innerHeight;

    size = Math.min(WIDTH / cols, (HEIGHT - PANEL) / rows)
    otstupX = (WIDTH - size * cols) / 2
    otstupY = PANEL + (HEIGHT - PANEL - size * rows) / 2

    CirX = otstupX + size / 2
    CirY = otstupY + size / 2
}
resize()

addEventListener("resize", (e) => {
    resize()
})

btnSave.addEventListener("click", () =>{
    if(isReady === false){
        btnSave.textContent = "Not ready!"

        let saveInterval = setInterval(() => {

            if(isReady === true){
                btnSave.textContent = "Save png"
                clearInterval(saveInterval)
            }
        },100)
        return
    }

    let a = document.createElement("a")

    let img = canvas.toDataURL("image/png")

    a.href = img
    a.download = "maze.png"
    a.click()
    
})

const createMap = () => {
    map = []
    for (let i = 0; i < cols; i++) {
        let mape =[];
        for(let n = 0; n < rows; n++){
            mape.push({
                left:       true,
                up:         true,
                right:      true,
                down:       true,

                visited:    false,

                seen:       false,

                parent: null,

            })
        }
        map.push(mape);
    }

    map[0][0].left = false
    map[cols - 1][rows - 1].right = false
}
createMap()

resize()


const draw = () =>{

    ctx.strokeStyle = "white";
    for(let i = 0; i < map.length; i++){
        for(let n = 0; n < map[i].length; n++){

            let x = i * size + otstupX
            let y = n * size + otstupY

            if(map[i][n].up === true){
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + size, y);
            ctx.stroke();
            }

            if (map[i][n].right === true){
                ctx.beginPath();
                ctx.moveTo(x + size, y);
                ctx.lineTo(x + size, y + size);
                ctx.stroke();
            }

            if(map[i][n].down === true){
                ctx.beginPath();
                ctx.moveTo(x + size, y + size);
                ctx.lineTo(x, y + size);
                ctx.stroke();
            }

            if(map[i][n].left === true){
                ctx.beginPath();
                ctx.moveTo(x, y + size);
                ctx.lineTo(x, y);
                ctx.stroke();
            }
        }
    }
}

let kletkaX
let kletkaY
let gdeTiBil = [];

const puhh = (x, y) =>{
    gdeTiBil.push({
        x: x,
        y: y,
    })
}

const generatorStep = () =>{
    speed = +(speedSelect.value)

    let canUp = false
    let canDown = false
    let canLeft = false
    let canRight = false
    let canGo = [];
    isReady = true


    for(let i = 0; i < cols; i++){
        for(let n = 0; n < rows; n++){
            if (map[i][n].visited === false){
                isReady = false
            }
        }
    }


    if(isReady === true){return}


    kletkaX = Math.floor((CirX - otstupX) / size)
    kletkaY = Math.floor((CirY - otstupY) / size)

if(kletkaY - 1 >= 0 && map[kletkaX][kletkaY - 1].visited === false){
    canUp = true
    canGo.push("up")
}if(kletkaY + 1 < rows && map[kletkaX][kletkaY + 1].visited === false){
    canDown = true
    canGo.push("down")
}if(kletkaX - 1 >= 0 && map[kletkaX - 1][kletkaY].visited === false){
    canLeft = true
    canGo.push("left")
}if(kletkaX + 1 < cols && map[kletkaX + 1][kletkaY].visited === false){
    canRight = true
    canGo.push("right")
}

    let RandD = canGo[Math.floor(Math.random() * canGo.length)]


    map[kletkaX][kletkaY].visited = true


if(Math.random() < teleportChance && gdeTiBil.length > 0){
    if(canGo.length > 0){
        puhh(kletkaX, kletkaY)
    }

    let rando = Math.floor(Math.random() * gdeTiBil.length)

    back = gdeTiBil[rando]
    gdeTiBil.splice(rando, 1)

    CirX = (otstupX + size / 2) + back.x * size
    CirY = (otstupY + size / 2) + back.y * size
}else if(RandD === "up"){
    CirY -= size
    puhh(kletkaX, kletkaY)
    map[kletkaX][kletkaY].up = false
    map[kletkaX][kletkaY - 1].down = false
}else if(RandD === "down"){
    CirY += size
    puhh(kletkaX, kletkaY)
    map[kletkaX][kletkaY].down = false
    map[kletkaX][kletkaY + 1].up = false
}else if(RandD === "left"){
    CirX -= size
    puhh(kletkaX, kletkaY)
    map[kletkaX][kletkaY].left = false
    map[kletkaX - 1][kletkaY].right = false
}else if(RandD === "right"){
    CirX += size
    puhh(kletkaX, kletkaY)
    map[kletkaX][kletkaY].right = false
    map[kletkaX + 1][kletkaY].left = false
}else{

    if(gdeTiBil.length === 0){
        return
    }

    back = gdeTiBil.pop()
    CirX = (otstupX + size / 2) + back.x * size
    CirY = (otstupY + size / 2) + back.y * size
}
}

const generator = () =>{
if(speed < 0){
    while(isReady === false){
    generatorStep()
}}else{generatorStep()}

    ctx.clearRect(0, 0, WIDTH, HEIGHT)
    draw()

if(isReady === true){return}

    ctx.beginPath()
    ctx.arc(CirX, CirY, size / 7, 0, Math.PI * 2)
    ctx.fillStyle = "red"
    ctx.fill();

    timerId = setTimeout(generator, speed)

}



let first = true

const clamp = (v) => {
    v = Math.floor(v) || 15
    return Math.max(2, Math.min(60, v))
}

const start = () => {
    first = true
    pathReady = false;
    isReady = false
    clearTimeout(timerId)
    cols = clamp(Number(inputW.value))
    rows = clamp(Number(inputH.value))
    inputW.value = cols
    inputH.value = rows
    let percent = Number(inputT.value)
    if(isNaN(percent)){
        percent = 30
    }
    percent = Math.max(0, Math.min(100, percent))
    inputT.value = percent
    teleportChance = percent / 100
    createMap()
    gdeTiBil = []
    resize()
    generator()
}

btnGenerate.addEventListener("click", () =>{
    speed = +(speedSelect.value)
    start()
})

addEventListener("keydown", (e) => {
    if(e.key === "Enter"){
        start()
    }
})


let punkte = [];
let pathReady = false;

addEventListener("click", (e) =>{

    if(isReady === false){return}



    let kX = Math.floor((e.clientX - otstupX) / size);
    let kY = Math.floor((e.clientY - otstupY) / size);

    let kordsX = (otstupX + size / 2) + kX * size;
    let kordsY = (otstupY + size / 2) + kY * size;

    if (kX < 0 || kX >= cols || kY < 0 || kY >= rows){return}

    if(punkte.length >= 2){
        punkte = [];
        ctx.clearRect(0, 0, WIDTH, HEIGHT)
        draw()
    }

    (first === true)? punkte.push({type: "start", x: kordsX, y : kordsY, kx: kX, ky: kY}) : punkte.push({type: "end", x: kordsX, y : kordsY, kx: kX, ky: kY});

    if (first === true) {
        ctx.beginPath()
        ctx.arc(punkte[0].x, punkte[0].y, size / 7, 0, Math.PI * 2)
        ctx.fillStyle = "red"
        ctx.fill();

    }else if(first === false){
        ctx.beginPath()
        ctx.arc(punkte[1].x, punkte[1].y, size / 7, 0, Math.PI * 2)
        ctx.fillStyle = "green"
        ctx.fill();
    }

    first = !first

})

let proverka

const drawPath = () => {
    ctx.clearRect(0,0, WIDTH, HEIGHT)
    draw()
    let cur = {kx: punkte[1].kx, ky: punkte[1].ky}
    ctx.beginPath()
    ctx.moveTo((otstupX + size / 2) + cur.kx * size, (otstupY + size / 2) + cur.ky * size)
    while(map[cur.kx][cur.ky].parent !== null){
        cur = map[cur.kx][cur.ky].parent
        ctx.lineTo((otstupX + size / 2) + cur.kx * size, (otstupY + size / 2) + cur.ky * size)
    }
    ctx.strokeStyle = "yellow"
    ctx.lineWidth = 4
    ctx.stroke()
    ctx.lineWidth = 1
    ctx.strokeStyle = "white"
}



const step = () =>{

    let next = [];

    for(let i = 0; i < proverka.length; i++){
    
        let c = proverka[i]
    
        if(c.ky - 1 >= 0 && map[c.kx][c.ky].up === false && map[c.kx][c.ky - 1].seen === false){
            map[c.kx][c.ky - 1].seen = true
            next.push({kx: c.kx, ky: c.ky - 1,})
            map[c.kx][c.ky - 1].parent = {kx: c.kx, ky: c.ky}

        }if(c.ky + 1 < rows && map[c.kx][c.ky].down === false && map[c.kx][c.ky + 1].seen === false){
            map[c.kx][c.ky + 1].seen = true
            next.push({kx: c.kx, ky: c.ky + 1})
            map[c.kx][c.ky + 1].parent = {kx: c.kx, ky: c.ky}

        }if(c.kx - 1 >= 0 && map[c.kx][c.ky].left === false && map[c.kx - 1][c.ky].seen === false){
            map[c.kx - 1][c.ky].seen = true
            next.push({kx: c.kx - 1, ky: c.ky})
            map[c.kx - 1][c.ky].parent = {kx: c.kx, ky: c.ky}

        }if(c.kx + 1 < cols && map[c.kx][c.ky].right === false && map[c.kx + 1][c.ky].seen === false){
            map[c.kx + 1][c.ky].seen = true
            next.push({kx: c.kx + 1, ky: c.ky})
            map[c.kx + 1][c.ky].parent = {kx: c.kx, ky: c.ky}
        }
    }
    proverka = next;

    if(map[punkte[1].kx][punkte[1].ky].seen === true){
        pathReady = true;
        return;
    }
}



const stepDraw = () =>{

    if(speed < 0){
        while(pathReady === false){
        step()
    }}else{step()}


    ctx.clearRect(0, 0, WIDTH, HEIGHT)
    draw()

    if (pathReady === true) {
        drawPath()
        return
    }

    for(let i = 0; i < proverka.length; i++){
        let c = proverka[i]

        let kordsX = (otstupX + size / 2) + c.kx * size;
        let kordsY = (otstupY + size / 2) + c.ky * size;

        ctx.beginPath()
        ctx.arc(kordsX, kordsY, size / 7, 0, Math.PI * 2)
        ctx.fillStyle = "red";
        ctx.fill();
    }

    setTimeout(stepDraw, speed)
}



btnFind.addEventListener("click", () =>{
    if(punkte.length !== 2){return}
    if(isReady === false){return}

    speed = +(speedSelect.value)
    pathReady = false
    proverka = [punkte[0]];

    for(let i = 0; i < cols; i++){
        for(let n = 0; n < rows; n++){
            map[i][n].seen = false
            map[i][n].parent = null
        }
    }

    map[punkte[0].kx][punkte[0].ky].seen = true

    stepDraw()
})

start()

