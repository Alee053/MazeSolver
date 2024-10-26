let table = [
  /*[1,1,1,0,1,1,0,1,0,1],
[0,0,1,0,0,1,0,0,0,1],
[0,1,1,1,1,1,1,1,0,1],
[0,0,0,0,0,0,0,1,0,1],
[0,1,1,1,1,1,0,1,1,1],
[0,1,0,0,0,1,1,1,1,0],
[0,1,1,1,1,0,1,1,0,0],
[0,0,0,1,0,0,1,1,1,1],
[1,1,0,1,0,0,0,0,0,1],
[1,1,0,1,1,1,1,1,1,1]*/
];
let vis = [];
let movx = [0, 1, 0, -1];
let movy = [-1, 0, 1, 0];
let ant = [];

let tamaño = 20;

let a = true;

let end;

let startx = 0;
let starty = 0;
let targetx = 19;
let targety = 19;

let posx = targetx,
  posy = targety;

let q = [];

let mode = 0;
//0 = start
//1 = wall
//2 = target
//3 = search

function init() {
  end = false;
  table.length = 0;
  vis.length = 0;
  ant.length = 0;

  for (let i = 0; i < tamaño; i++) {
    let aux = [];
    for (let i = 0; i < tamaño; i++) {
      aux.push(1);
    }
    table.push(aux);
  }

  for (let i = 0; i < tamaño; i++) {
    let aux = [];
    for (let i = 0; i < tamaño; i++) {
      aux.push(0);
    }
    vis.push(aux);
  }
  for (let i = 0; i < tamaño; i++) {
    let aux = [];
    for (let i = 0; i < tamaño; i++) {
      aux.push([0, 0]);
    }
    ant.push(aux);
  }
  q.length = 0;
  q.unshift([starty, startx]);
  vis[starty][startx] = 1;
  table[starty][startx] = 3;

  table[targety][targetx] = 4;
}

function paint() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  if (mode == 0) {
    table[starty][startx] = 1;
    starty = floor(mouseY / (height / tamaño));
    startx = floor(mouseX / (height / tamaño));
    table[starty][startx] = 3;
  }
  if (mode == 1) {
    table[floor(mouseY / (height / tamaño))][
      floor(mouseX / (height / tamaño))
    ] = 0;
  }
  if (mode == 2) {
    table[targety][targetx] = 1;
    table[floor(mouseY / (height / tamaño))][
      floor(mouseX / (height / tamaño))
    ] = 4;
    targetx = floor(mouseX / (height / tamaño));
    targety = floor(mouseY / (height / tamaño));
  }
}
function resetSearch() {
  for (let i = 0; i < tamaño; i++) {
    for (let j = 0; j < tamaño; j++) {
      if ((i == starty && j == startx) || (i == targety && j == targetx))
        continue;
      if (table[i][j] === 2 || table[i][j] === 3) {
        table[i][j] = 1;
      }
    }
  }
  for (let i = 0; i < tamaño; i++) {
    for (let j = 0; j < tamaño; j++) {
      vis[i][j] = 0;
      ant[i][j] = [0, 0];
    }
  }
  q.length = 0;
  q.unshift([starty, startx]);
  vis[starty][startx] = 1;
  table[starty][startx] = 3;
  end = false;
  posx = targetx;
  posy = targety;
}

function setup() {
  createCanvas(600, 600);
  frameRate(60);
  init();

  let start = createButton("Start");
  let wall = createButton("Wall");
  let target = createButton("Target");
  let reset = createButton("Reset");
  let search = createButton("Search");

  start.mousePressed(() => {
    mode = 0;
    resetSearch();
  });
  wall.mousePressed(() => {
    mode = 1;
    resetSearch();
  });
  target.mousePressed(() => {
    mode = 2;
    resetSearch();
  });
  reset.mousePressed(() => {
    init();
    mode = 0;
    resetSearch();
  });
  search.mousePressed(() => {
    resetSearch();
    mode = 3;
  });
}

function mouseDragged() {
  paint();
}

function drawBoard() {
  for (let i = 0; i < tamaño; i++) {
    for (let j = 0; j < tamaño; j++) {
      if (table[i][j] === 1) {
        fill(132, 200, 255);
        square((j * height) / tamaño, (i * height) / tamaño, height / tamaño);
      }
      if (table[i][j] === 2) {
        fill(132, 200, 0);
        square((j * height) / tamaño, (i * height) / tamaño, height / tamaño);
      }
      if (table[i][j] === 3) {
        fill(255, 100, 100);
        square((j * height) / tamaño, (i * height) / tamaño, height / tamaño);
      }
      if (table[i][j] === 4) {
        fill(255, 167, 89);
        square((j * height) / tamaño, (i * height) / tamaño, height / tamaño);
      }
      if (table[i][j] === 5) {
        fill(255, 255, 255);
        square((j * height) / tamaño, (i * height) / tamaño, height / tamaño);
      }
    }
  }
}
function draw() {
  background(1, 200, 121);
  stroke(255);
  noStroke();

  if (mode == 3) {
    drawBoard();

    if (q.length > 0 && !end) {
      let actual = q[q.length - 1];
      q.pop();

      for (let i = 0; i < 4; i++) {
        let vecino = [0, 0];

        if (i == 0 && actual[0] > 0) {
          vecino = [actual[0] + movy[i], actual[1] + movx[i]];
        } else if (i == 1 && actual[1] < tamaño - 1) {
          vecino = [actual[0] + movy[i], actual[1] + movx[i]];
        } else if (i == 2 && actual[0] < tamaño - 1) {
          vecino = [actual[0] + movy[i], actual[1] + movx[i]];
        } else if (i == 3 && actual[1] > 0) {
          vecino = [actual[0] + movy[i], actual[1] + movx[i]];
        } else continue;
        //console.log(i,":",vecino[0],vecino[1])
        if (!vis[vecino[0]][vecino[1]] && table[vecino[0]][vecino[1]] != 0) {
          q.unshift([vecino[0], vecino[1]]);
          vis[vecino[0]][vecino[1]] = 1;
          table[vecino[0]][vecino[1]] = 2;
          ant[vecino[0]][vecino[1]] = [actual[0], actual[1]];
        }
      }
    }

    if (vis[posy][posx]) {
      end = true;
      if (posx != startx || posy != starty) {
        let aux = posx;
        table[posy][posx] = 3;
        posx = ant[posy][posx][1];
        posy = ant[posy][aux][0];
      }
      table[targety][targetx] = 4;
      table[starty][startx] = 3;
    }
  } else {
    stroke(255);
    drawBoard();
  }
}
