/*
Andrew Deal
PM Period
*/

// Create Objects for Paddles and Ball //
const img = new Image();
img.src = 'white.png';

let padl1 = {"image": img, "x": 20, "y": 60, "width": 4, "height": 22};
let padl2 = {"x": (280), "y": 60, "width": 4, "height": 22};
let ball = {"x": 145, "y": 70, "width": 4, "height": 4};

// Initiate Variables //
const padlSpeed = 13;
const bSpeed = 0.5;
let ballSpeedX = 0;
let ballSpeedY = 0;
let p1Score = 0;
let p2Score = 0;

// Redraw Function //
function drawPong() {
  let c = document.getElementById("myCanvas");
  let ctx = c.getContext("2d");

  ctx.clearRect(0, 0, c.width, c.height);

  // Draw Paddles
  ctx.drawImage(padl1.image, 10, 10, padl1.width, padl1.height, padl1.x, padl1.y, padl1.width, padl1.height);

  ctx.drawImage(padl1.image, 10, 10, padl2.width, padl2.height, padl2.x, padl2.y, padl2.width, padl2.height);
  
  // Draw Score 
  ctx.fillStyle = "white";
  ctx.font = "18px Arial";
  ctx.fillText(p2Score, 100, 30);
  ctx.fillText(p1Score, 185, 30);

  // Draw "Net"
  ctx.font = "9px Arial";
  ctx.fillText('|', 145, 8);
  ctx.fillText('|', 145, 27);
  ctx.fillText('|', 145, 47);
  ctx.fillText('|', 145, 67);
  ctx.fillText('|', 145, 87);
  ctx.fillText('|', 145, 107);
  ctx.fillText('|', 145, 127);
  ctx.fillText('|', 145, 147);
  
  // Draw Ball
  ctx.drawImage(padl1.image, 10, 10, ball.width, ball.height, ball.x, ball.y, ball.width, ball.height);

  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
  ctx.rect(ball.x, ball.y, ball.width, ball.height);
  ctx.stroke();
}

// Start Ball Moving //
function sendBall() {
  ball.x = 145
  ball.y = 70
  ballSpeedX = bSpeed * (Math.round(Math.random()) * 2 - 1)
  ballSpeedY = (bSpeed / 1.3) * (Math.round(Math.random()) * 2 - 1)
}

// First Draw //
sendBall();
drawPong();

// Get Key Press //
document.addEventListener('keydown', function(event) {
  const key = event.key; // "w", "s", "ArrowUp", or "ArrowDown"
  
  switch(key) {
    case "ArrowUp":
      if (padl2.y > 10) {
        padl2.y -= padlSpeed
      }
      break;
    case "ArrowDown":
      if (padl2.y < 140 - padl2.height) {
        padl2.y += padlSpeed
      }
      break;
    case "w":
      if (padl1.y > 10) {
        padl1.y -= padlSpeed
      }
      break;
    case "s":
      if (padl1.y < 140 - padl1.height) {
        padl1.y += padlSpeed
      }
      break;
    default:
      break;
  }
});

// Initiate Collision Variables //
let colP1S = false;
let colP1T = false;
let colP1B = false;
let colP2S = false;
let colP2T = false;
let colP2B = false;
let colFloorCeil = false;
let colCSide = false;

function sleep(ms) {
  return new Promise((resolve=>setTimeout(resolve,ms)))
}

// Call Game Updates //
async function updateGame() {
  while (true) {
    drawPong();
    ball.x += ballSpeedX;
    ball.y += ballSpeedY;

    // Check for Collisions 

      //Def Working
    colP1S = (ball.x > padl1.x) && (ball.x <= padl1.x + padl1.width) && ((ball.y + ball.height >= padl1.y) && (ball.y <= padl1.y + padl1.height)); //Col = colliding | P1 = paddle 1 | S = side
    colP2S = (ball.x < padl2.x) && (ball.x + ball.width >= padl2.x) && ((ball.y + ball.height >= padl2.y) && (ball.y <= padl2.y + padl2.height) ); //&& (! (ball.x + ball.width >= padl2.x && ball.x <= padl2.x + padl2.width))); 

    colFloorCeil = (ball.y <= 0 || ball.y + ball.height > 150);
    colCSide = (ball.x <= 0) || (ball.x + ball.width >= 300); // Cside = canvas side

    // Ball hits side of canvas (needs to be reset)
    if (colCSide) {
      if (ball.x < 150) {
        p1Score += 1;
      } else {
        p2Score += 1;
      }

      // Reset
      sleep(25);
      sendBall();
    } else if (colP1S) {
      ballSpeedX = Math.abs(ballSpeedX); // Ball hit on side of paddles
    } else if (colP2S) {
      ballSpeedX = -(Math.abs(ballSpeedX));
    } else if (colFloorCeil) { // Ball hit on top/bottom (decided to scrap for now) //|| colP1T || colP1B || colP2T || colP2B
      ballSpeedY *= -1;
    } 
    
    //Wait for 50 seconds
    await sleep(1);
  }
}

updateGame();

