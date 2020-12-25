import applyAbstractCode from "../lib/index.js";

applyAbstractCode(
  document.getElementById("canvas"),
  {
    segmentCornerRadius: 5,
    segmentHeight: 20,
    lineHeight: 40,
    linesShown: 4,
    segmentAnimationSpeed: 10,
    scrollSpeed: 4,
  },
  [
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
  ]
);
