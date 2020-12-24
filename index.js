AbstractCode(document.getElementById("canvas"));

function AbstractCode(canvas) {
  const ctx = canvas.getContext("2d");

  const lineWidth = 20;
  const lineSpacing = 40;
  const linesShown = 4;
  const speed = 10;

  canvas.height = lineSpacing * linesShown - lineWidth / 2;
  canvas.width = 1000;
  shiftLineSpeed = 4;

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

  (async function loopLines() {
    await new Promise((resolve) => {
      (async () => {
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
      })();
    }).then(() => {
      lines.push(lines.shift());
      loopLines();
    });
  })();

  function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  }

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
}
