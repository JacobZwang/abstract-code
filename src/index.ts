/**
 * Abstract Code: simplistic async code animation written in typescript
 *
 * @author Jacob Zwang
 * status: not ready for use
 * todo: npm package, procedural code generation, color pallets, documentation
 */

type options = {
  segmentCornerRadius?: number;
  segmentHeight?: number;
  lineHeight?: number;
  linesShown?: number;
  segmentAnimationSpeed?: number;
  scrollSpeed?: number;
  segmentSpacing?: number;
};
type lines = Array<line>;
type line = Array<segment>;
type segment = [length, color];
type length = number;
type color = string;
type canvas = {
  segment: (
    x: number,
    y: number,
    width: number,
    height: number,
    color: string
  ) => void;

  clear: () => void;
};
type code = {
  drawStaticLine: (lineNumber: number, translationY?: number) => void;
  drawAnimatedSegment: (lineNum: number, segmentNum: number) => Promise<void>;
};

export default function applyAbstractCode(
  target: HTMLCanvasElement,
  options: options,
  lines: lines
): void {
  const safeOptions = {
    segmentCornerRadius: options.segmentCornerRadius ?? 5,
    segmentHeight: options.segmentHeight ?? 20,
    lineHeight: options.lineHeight ?? 40,
    linesShown: options.linesShown ?? 4,
    segmentAnimationSpeed: options.segmentAnimationSpeed ?? 10,
    scrollSpeed: options.scrollSpeed ?? 4,
    segmentSpacing: options.segmentSpacing ?? 10,
  };
  const canvas = ((target: HTMLCanvasElement): canvas => {
    const ctx =
      target.getContext("2d") ??
      (() => {
        throw "Failed to get canvas context. Is the target of type HTMLCanvasElement?";
      })();
    return {
      // draws a colored block at given location and size
      segment(
        x: number,
        y: number,
        width: number,
        height: number,
        color: string
      ) {
        // adjusts radius during animation to avoid artifacting
        const adjustedRadius: number =
          safeOptions.segmentCornerRadius *
          (height / safeOptions.segmentHeight);
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.moveTo(x + adjustedRadius, y);
        ctx.lineTo(x + width - adjustedRadius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + adjustedRadius);
        ctx.lineTo(x + width, y + height - adjustedRadius);
        ctx.quadraticCurveTo(
          x + width,
          y + height,
          x + width - adjustedRadius,
          y + height
        );
        ctx.lineTo(x + adjustedRadius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - adjustedRadius);
        ctx.lineTo(x, y + adjustedRadius);
        ctx.quadraticCurveTo(x, y, x + adjustedRadius, y);
        ctx.closePath();
        ctx.fill();
      },
      // clears the entire canvas
      clear() {
        ctx.clearRect(0, 0, target.width, target.height);
      },
    };
  })(target);

  const code = ((canvas: canvas): code => {
    function drawStaticSegment(
      lineNum: number,
      segmentNum: number,
      translationY: number
    ) {
      canvas.segment(
        previousSegmentsTotal(lines[lineNum], segmentNum),
        lineNum * safeOptions.lineHeight - 1 - translationY + 5,
        lines[lineNum][segmentNum][0] - 1,
        safeOptions.segmentHeight,
        lines[lineNum][segmentNum][1]
      );
    }

    // calculates distance before the given word
    function previousSegmentsTotal(line: line, currentSegmentNum: number) {
      let sum = 0;
      for (let segmentNum = 0; segmentNum < currentSegmentNum; segmentNum++) {
        sum = sum + line[segmentNum][0] + safeOptions.segmentSpacing;
      }
      return sum;
    }

    return {
      drawStaticLine(lineNumber: number, translationY?: number): void {
        const checkedTranslationY =
          typeof translationY !== "number" ? 0 : translationY;
        lines[lineNumber].forEach((value, segmentNum): void => {
          drawStaticSegment(lineNumber, segmentNum, checkedTranslationY);
        });
      },

      drawAnimatedSegment(lineNum: number, segmentNum: number): Promise<void> {
        return new Promise((resolve: (value: void) => void): void => {
          function animateSegment(lineMultiplier: number): void {
            canvas.segment(
              previousSegmentsTotal(lines[lineNum], segmentNum),
              lineNum * safeOptions.lineHeight +
                safeOptions.segmentHeight / 2 -
                (safeOptions.segmentHeight *
                  (lineMultiplier / safeOptions.segmentAnimationSpeed)) /
                  2 +
                5,
              lines[lineNum][segmentNum][0] *
                (lineMultiplier / safeOptions.segmentAnimationSpeed),
              safeOptions.segmentHeight *
                (lineMultiplier / safeOptions.segmentAnimationSpeed),
              lines[lineNum][segmentNum][1]
            );

            if (lineMultiplier < safeOptions.segmentAnimationSpeed) {
              requestAnimationFrame(() => {
                animateSegment(lineMultiplier + 1);
                if (
                  lineMultiplier ===
                  safeOptions.segmentAnimationSpeed *
                    (1 - 1 / safeOptions.segmentAnimationSpeed)
                ) {
                  resolve();
                }
              });
            }
          }
          requestAnimationFrame(() => {
            animateSegment(0);
          });
        });
      },
    };
  })(canvas);

  (async function loopLines(): Promise<void> {
    await new Promise((resolve: (value: void) => void): void => {
      (async () => {
        for (let lineNum = 0; lineNum < safeOptions.linesShown - 1; lineNum++) {
          code.drawStaticLine(lineNum);
        }
        for (
          let segmentNum = 0;
          segmentNum < lines[safeOptions.linesShown - 1].length;
          segmentNum++
        ) {
          await code.drawAnimatedSegment(
            safeOptions.linesShown - 1,
            segmentNum
          );
        }
        // recursively moves all lines up
        (function scroll(distanceTraveled: number): void {
          canvas.clear();
          for (let lineNum = 0; lineNum < safeOptions.linesShown; lineNum++) {
            code.drawStaticLine(lineNum, distanceTraveled);
          }
          if (distanceTraveled <= safeOptions.lineHeight) {
            requestAnimationFrame(() => {
              scroll(distanceTraveled + safeOptions.scrollSpeed);
              if (distanceTraveled === safeOptions.lineHeight) {
                resolve();
              }
            });
          }
        })(0);
      })();
    }).then((): void => {
      lines.push(lines.shift() as line);
      loopLines();
    });
  })();
}
