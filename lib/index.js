AbstractCode(document.getElementById("canvas"), 5);
function AbstractCode(canvas, radius) {
    const lineHeight = 20;
    const lineSpacing = 40;
    const linesShown = 4;
    const speed = 10;
    const shiftLineSpeed = 4;
    canvas = (() => {
        const ctx = canvas.getContext("2d");
        const canvasHeight = lineSpacing * linesShown - lineHeight / 2;
        const canvasWidth = 1000;
        const adjustedRadius = (height) => radius * (height / lineHeight);
        return {
            segment(x, y, width, height, color) {
                ctx.beginPath();
                ctx.fillStyle = color;
                ctx.moveTo(x + adjustedRadius(height), y);
                ctx.lineTo(x + width - adjustedRadius(height), y);
                ctx.quadraticCurveTo(x + width, y, x + width, y + adjustedRadius(height));
                ctx.lineTo(x + width, y + height - adjustedRadius(height));
                ctx.quadraticCurveTo(x + width, y + height, x + width - adjustedRadius(height), y + height);
                ctx.lineTo(x + adjustedRadius(height), y + height);
                ctx.quadraticCurveTo(x, y + height, x, y + height - adjustedRadius(height));
                ctx.lineTo(x, y + adjustedRadius(height));
                ctx.quadraticCurveTo(x, y, x + adjustedRadius(height), y);
                ctx.closePath();
                ctx.fill();
            },
            clear() {
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            },
        };
    })();
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
                    await drawAnimatedSegment(linesShown - 1, j);
                }
                (function shiftLineUp(i) {
                    canvas.clear();
                    for (let count = 0; count < linesShown; count++) {
                        for (const j in lines[count]) {
                            drawStaticSegment(count, j, i);
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
    function drawStaticLine(lineNumber) {
        for (const segment in lines[lineNumber]) {
            drawStaticSegment(lineNumber, segment, 0);
        }
    }
    function drawStaticSegment(i, j, yTransformer) {
        canvas.segment(previousSegmentsTotal(lines[i], j), i * lineSpacing - 1 - yTransformer + 5, lines[i][j][0] - 1, lineHeight, lines[i][j][1]);
    }
    function drawAnimatedSegment(i, j) {
        return new Promise((resolve) => {
            function animateSegment(lineMultiplier) {
                canvas.segment(previousSegmentsTotal(lines[i], j), i * lineSpacing +
                    lineHeight / 2 -
                    (lineHeight * (lineMultiplier / speed)) / 2 +
                    5, lines[i][j][0] * (lineMultiplier / speed), lineHeight * (lineMultiplier / speed), lines[i][j][1]);
                if (lineMultiplier < speed) {
                    requestAnimationFrame(() => {
                        animateSegment(lineMultiplier + 1);
                        if (lineMultiplier === speed * (1 - 1 / speed)) {
                            resolve();
                        }
                    });
                }
            }
            requestAnimationFrame(() => {
                animateSegment(0);
            });
        });
    }
    function previousSegmentsTotal(line, i) {
        let sum = 0;
        for (const j in line) {
            if (j < i) {
                sum = sum + line[j][0] + 10;
            }
        }
        return sum;
    }
}
//# sourceMappingURL=index.js.map