export const hexToRGB = (h: any) => {
  let r: any = 0,
    g: any = 0,
    b: any = 0,
    a: any = 1;

  if (h.length == 4) {
    r = "0x" + h[1] + h[1];
    g = "0x" + h[2] + h[2];
    b = "0x" + h[3] + h[3];
  } else if (h.length == 7) {
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
  } else if (h.length == 5) {
    //hexA
    r = "0x" + h[1] + h[1];
    g = "0x" + h[2] + h[2];
    b = "0x" + h[3] + h[3];
    a = "0x" + h[4] + h[4];
  } else if (h.length == 9) {
    //hexA
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
    a = "0x" + h[7] + h[8];
  }

  return {
    red: r,
    green: g,
    blue: b,
    alpha: a,
  };
};

export function convertColor(color: any, hsbToHex: Function) {
  let colorConverted = "";
  {
    typeof color == "object"
      ? (colorConverted = hsbToHex(color))
      : (colorConverted = color);
  }
  if (color.alpha < 1) {
    colorConverted += ((color.alpha * 255) | (1 << 8)).toString(16).slice(1);
  }
  return colorConverted;
}
