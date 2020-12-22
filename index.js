function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === "undefined") {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  if (typeof radius === "number") {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }

  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius.br,
    y + height
  );
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
}

let canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");
const lines = [
  [
    [200, "red"],
    [150, "green"],
    [300, "green"],
    [80, "green"],
  ],
  [
    [70, "rgba(0,0,0,0)"],
    [200, "gray"],
    [150, "green"],
    [130, "green"],
  ],
  [
    [70, "rgba(0,0,0,0)"],
    [130, "red"],
    [200, "green"],
    [180, "green"],
  ],
  [
    [140, "rgba(0,0,0,0)"],
    [130, "gray"],
    [70, "green"],
    [100, "green"],
  ],
  [
    [140, "rgba(0,0,0,0)"],
    [60, "red"],
    [90, "green"],
    [120, "green"],
  ],
  [
    [70, "rgba(0,0,0,0)"],
    [120, "red"],
    [150, "green"],
  ],
  [
    [70, "rgba(0,0,0,0)"],
    [90, "red"],
    [120, "green"],
    [150, "green"],
  ],
];

const lineWidth = 20;
const lineSpacing = 40;
const linesShown = 4;
const speed = 10;

canvas.height = lineSpacing * linesShown - lineWidth / 2;
canvas.width = 1000;
shiftLineSpeed = 4;

async function loopLines() {
  await new Promise((resolve) => {
    async function drawLines() {
      for (let count = 0; count < linesShown - 1; count++) {
        drawStaticLine(count);
      }
      for (const j in lines[linesShown - 1]) {
        await drawAnimatedWord(linesShown - 1, j);
      }
      (function shiftLineUp(i) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let count = 0; count < linesShown; count++) {
          for (const j in lines[count]) {
            drawStaticWord(count, j, i);
          }
        }
        if (i <= lineSpacing) {
          requestAnimationFrame(() => {
            shiftLineUp(i + shiftLineSpeed);
            if (i === lineSpacing) {
              resolve();
            }
          });
        }
      })(0);
    }
    drawLines();
  }).then(() => {
    lines.push(lines.shift());
    loopLines();
  });
}

loopLines();

function drawStaticLine(lineNumber) {
  for (const j in lines[lineNumber]) {
    drawStaticWord(lineNumber, j, 0);
  }
}

function drawStaticWord(i, j, yTransformer) {
  ctx.fillStyle = lines[i][j][1];
  roundRect(
    ctx,
    previousWordsTotal(lines[i], j),
    i * lineSpacing - 1 - yTransformer + 5,
    lines[i][j][0] - 1,
    lineWidth,
    5,
    true,
    false
  );
}

function drawAnimatedWord(i, j) {
  return new Promise((resolve) => {
    function animateWord(lineMultiplier) {
      ctx.clearRect(
        previousWordsTotal(lines[i], j),
        i * lineSpacing,
        lines[i][j][0],
        lineSpacing
      );

      ctx.fillStyle = lines[i][j][1];
      roundRect(
        ctx,
        previousWordsTotal(lines[i], j),
        i * lineSpacing +
          lineWidth / 2 -
          (lineWidth * (lineMultiplier / speed)) / 2 +
          5,
        lines[i][j][0] * (lineMultiplier / speed),
        lineWidth * (lineMultiplier / speed),
        5 * (lineMultiplier / speed),
        true,
        false
      );

      if (lineMultiplier < speed) {
        requestAnimationFrame(() => {
          animateWord(lineMultiplier + 1);
          if (lineMultiplier === speed * (1 - 1 / speed)) {
            resolve();
          }
        });
      }
    }
    requestAnimationFrame(() => {
      animateWord(0);
    });
  });
}

function previousWordsTotal(line, i) {
  let sum = 0;
  for (const j in line) {
    if (j < i) {
      sum = sum + line[j][0] + 10;
    }
  }
  return sum;
}
