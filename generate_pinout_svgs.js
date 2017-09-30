#!/usr/bin/env node

const title = 'DISTRAP Bus Connector v0.6';

const sigDefaults = {
  bgColor: '#ffffff',
  textColor: '#000000',
  notes: ''
};

const signals = {
  'N/C': {
    bgColor: '#cccccc',
    notes: 'Not Connected'
  },
  '5VDC': {
    textColor: '#ffffff',
    bgColor: '#ff3344',
    notes: 'Max 250mA per device'
  },
  '12VDC': {
    bgColor: '#fdff41',
    notes: '5A per pin max'
  },
  'GND': {
    textColor: '#ffffff',
    bgColor: '#000000',
    notes: 'Common ground'
  },
  'CAN LO': {
    bgColor: '#c0ffbf',
    notes: 'CANbus LO signal'
  },
  'CAN HI': {
    bgColor: '#bfffff',
    notes: 'CANbus HI signal'
  },
  'CAN GND': {
    bgColor: '#003366',
    textColor: '#ffffff',
    notes: 'CANbus GND'
  },
};

const pinouts = {
  '2x2': {
    notes: '4-pin dual-row MOLEX Mini-Fit Jr (4.2mm pitch); no power rail',
    pinout: [
      ['CAN HI', 'CAN LO'],
      ['N/C', 'CAN GND'],
    ]
  },
  '2x3': {
    notes: '6-pin dual-row MOLEX Mini-Fit Jr (4.2mm pitch); 5A power rail',
    pinout: [
      ['CAN HI', 'CAN LO'],
      ['5VDC', 'CAN GND'],
      ['12VDC', 'GND'],
    ]
  },
  '2x4': {
    notes: '8-pin dual-row MOLEX Mini-Fit Jr (4.2mm pitch); 10A power rail',
    pinout: [
      ['CAN HI', 'CAN LO'],
      ['5VDC', 'CAN GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
    ]
  },
  '2x5': {
    notes: '10-pin dual-row MOLEX Mini-Fit Jr (4.2mm pitch); 15A power rail',
    pinout: [
      ['CAN HI', 'CAN LO'],
      ['5VDC', 'CAN GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
    ]
  },
  '2x6': {
    notes: '12-pin dual-row MOLEX Mini-Fit Jr (4.2mm pitch); 20A power rail',
    pinout: [
      ['CAN HI', 'CAN LO'],
      ['5VDC', 'CAN GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
    ]
  },
  '2x7': {
    notes: '14-pin dual-row MOLEX Mini-Fit Jr (4.2mm pitch); 25A power rail',
    pinout: [
      ['CAN HI', 'CAN LO'],
      ['5VDC', 'CAN GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
    ]
  },
  '2x8': {
    notes: '16-pin dual-row MOLEX Mini-Fit Jr (4.2mm pitch); 30A power rail',
    pinout: [
      ['CAN HI', 'CAN LO'],
      ['5VDC', 'CAN GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
    ]
  },
  '2x9': {
    notes: '18-pin dual-row MOLEX Mini-Fit Jr (4.2mm pitch); 35A power rail',
    pinout: [
      ['CAN HI', 'CAN LO'],
      ['5VDC', 'CAN GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
    ]
  },
  '2x10': {
    notes: '20-pin dual-row MOLEX Mini-Fit Jr (4.2mm pitch); 40A power rail',
    pinout: [
      ['CAN HI', 'CAN LO'],
      ['5VDC', 'CAN GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
    ]
  },
  '2x11': {
    notes: '22-pin dual-row MOLEX Mini-Fit Jr (4.2mm pitch); 45A power rail',
    pinout: [
      ['CAN HI', 'CAN LO'],
      ['5VDC', 'CAN GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
    ]
  },
  '2x12': {
    notes: '24-pin dual-row MOLEX Mini-Fit Jr (4.2mm pitch); 50A power rail',
    pinout: [
      ['CAN HI', 'CAN LO'],
      ['5VDC', 'CAN GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
    ]
  },
};

// 1 = notched, 0 = square
const minifitKeys = [
  0, 1, // 2x1
  1, 0, // 2x2
  1, 0, // 2x3
  0, 1, // 2x4
  0, 1, // 2x5
  1, 0, // 2x6
  1, 0, // 2x7
  0, 1, // 2x8
  0, 1, // 2x9
  1, 0, // 2x10
  1, 0, // 2x11
  0, 1, // 2x12
];
const connectorShapes = {
  receptacle: ({x, y, colCount, gridW, gridH, id}) => `
<path d="M${x - 6},${y - 6}
      L${colCount * gridW + x + 3},${y - 6}
      L${colCount * gridW + x + 3},${gridH * 2 + y + 3}
      L${x - 6},${gridH * 2 + y + 3} L${x - 6},${y - 6} z"
      fill="#eeeeee" stroke="#666666" stroke-width="3" />
<path d="M${x + colCount / 2 * gridW - gridW / 2 - 6},${y - 4}
      L${x + colCount / 2 * gridW - gridW / 2 - 6},${y - 26}
      L${x + colCount / 2 * gridW + gridW / 2 + 3},${y - 26}
      L${x + colCount / 2 * gridW + gridW / 2 + 3},${y - 4}"
      fill="#eeeeee" stroke="#666666" stroke-width="3" />
<path d="M${x + colCount / 2 * gridW - gridW / 2 + 13},${y - 6}
      L${x + colCount / 2 * gridW - gridW / 2 + 13},${y - 16}
      L${x + colCount / 2 * gridW + gridW / 2 - 16},${y - 16}
      L${x + colCount / 2 * gridW + gridW / 2 - 16},${y - 6}
      L${x + colCount / 2 * gridW - gridW / 2 + 13},${y - 6}"
      fill="#ffffff" stroke="#666666" stroke-width="3" />
<text x="${x}" y="${y + gridH * 2 + 26}">
  <tspan font-family="HelveticaNeue" font-size="18" fill="#000000">Receptacle, front view</tspan>
</text>`,
  plug: ({x, y, colCount, gridW, gridH, id}) => `
<path d="M${x - 6},${y - 6}
      L${x + colCount / 2 * gridW - gridW / 2 + 13},${y - 6}
      L${x + colCount / 2 * gridW - gridW / 2 + 13},${y - 16}
      L${x + colCount / 2 * gridW + gridW / 2 - 16},${y - 16}
      L${x + colCount / 2 * gridW + gridW / 2 - 16},${y - 6}
      L${colCount * gridW + x + 3},${y - 6}
      L${colCount * gridW + x + 3},${gridH * 2 + y + 3}
      L${x - 6},${gridH * 2 + y + 3} L${x - 6},${y - 6} z"
      fill="#eeeeee" stroke="#666666" stroke-width="3" />
<text x="${x}" y="${y + gridH * 2 + 26}">
  <tspan font-family="HelveticaNeue" font-size="18" fill="#000000">Plug/header, front view</tspan>
</text>`,
};
const keyShapes = [
  // squared:
  (x, y, {textColor, bgColor, pinNumber}) => `
<path d="M${x},${y} L${x + 58},${y} L${x + 58},${y + 58} L${x},${y + 58} L${x},${y} z" fill="${bgColor}"/>
<path d="M${x},${y} L${x + 58},${y} L${x + 58},${y + 58} L${x},${y + 58} L${x},${y} z" fill-opacity="0"
      stroke="#333333" stroke-width="1"/>
<text x="${x + 29}" y="${y + 29}" text-anchor="middle" dominant-baseline="central">
  <tspan font-family="HelveticaNeue-Bold" font-size="24" fill="${textColor}">${pinNumber}</tspan>
</text>`,
  // notched
  (x, y, {textColor, bgColor, pinNumber}) => `
<path d="M${x},${y} L${x + 58},${y} L${x + 58},${y + 41} L${x + 40},${y + 58} L${x + 17},${y + 58}
      L${x},${y + 41} L${x},${y} z"
      fill="${bgColor}"/>
<path d="M${x},${y} L${x + 58},${y} L${x + 58},${y + 41} L${x + 40},${y + 58} L${x + 17},${y + 58}
      L${x},${y + 41} L${x},${y} z"
      fill-opacity="0" stroke="#333333" stroke-width="1"/>
<text x="${x + 29}" y="${y + 29}" text-anchor="middle" dominant-baseline="central">
  <tspan font-family="HelveticaNeue-Bold" font-size="24" fill="${textColor}">${pinNumber}</tspan>
</text>`,
];

const svgTemplate = ({width, height, id, notes, connectors}) => `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     x="0" y="0" width="${width}" height="${height}" viewBox="0, 0, ${width}, ${height}">
<text x="20" y="42">
  <tspan font-family="HelveticaNeue-Bold" font-size="36" fill="#000000">${title}: ${id}</tspan>
</text>
<text x="20" y="72">
  <tspan font-family="HelveticaNeue-Bold" font-size="18" fill="#000000">${notes}</tspan>
</text>
${connectors}
<text x="20" y="520">
  <tspan font-family="HelveticaNeue-Bold" font-size="24" fill="#000000">Pinout</tspan>
</text>
</svg>
`;

const pinoutRowTemplate = (y, {pinNumber, label, notes, bgColor, textColor}) => `
<circle cx="30" cy="${y - 12}" r="16" fill="${bgColor}" stroke="#333333" stroke-width="2" />
<text x="30" y="${y - 12}" text-anchor="middle" dominant-baseline="central">
  <tspan font-family="HelveticaNeue-Bold" font-size="22" fill="${textColor}">${pinNumber}</tspan>
</text>
<text x="54" y="${y - 12}" dominant-baseline="central" text-anchor="left">
  <tspan font-family="HelveticaNeue-Bold" font-size="18" fill="#000000">${label}</tspan>
</text>
<text x="140" y="${y - 12}" dominant-baseline="central" text-anchor="left">
  <tspan font-family="HelveticaNeue" font-size="18" fill="#000000">${notes}</tspan>
</text>
`;

const mkSVG = id => {
  let pinIndex = 0;
  const gridW = 62;
  const gridH = 62;
  let colNum = 1;
  let x = 20;
  let y = 130 + gridH;
  let isLower = true;
  const pinData = pinouts[id];
  const notes = pinData.notes;
  const cols = pinData.pinout;
  const colCount = cols.length;
  const pinLegend = {};
  const pinoutSVGarr = [];
  pinoutSVGarr.push(connectorShapes.receptacle({x, y: y - gridH, colCount, gridW, gridH, id}));
  cols.forEach(rows => {
    rows.forEach(sigId => {
      const sig = signals[sigId];
      const pinNumber = isLower ? colNum : colNum + colCount;
      const pinParam = {
        x, y,
        textColor: sig.textColor ? sig.textColor : sigDefaults.textColor,
        bgColor: sig.bgColor ? sig.bgColor : sigDefaults.bgColor,
        pinNumber,
        label: sigId,
        notes: sig.notes ? sig.notes : sigDefaults.notes,
        minifitKey: minifitKeys[pinIndex]
      };
      pinLegend[pinNumber] = pinParam;
      pinoutSVGarr.push(keyShapes[pinParam.minifitKey](x, y, pinParam));
      if (!isLower) {
        colNum++;
        x += gridW;
        y += gridH;
      }
      else {
        y -= gridH;
      }
      isLower = !isLower;
      pinIndex++;
    });
  });
  pinIndex = 0;
  colNum = 1;
  y += gridH * 3;
  x = 20;
  isLower = true;
  pinoutSVGarr.push(connectorShapes.plug({x, y: y - gridH, colCount, gridW, gridH, id}));
  x = (colCount - 1) * gridW + 20;
  cols.forEach(rows => {
    rows.forEach(sigId => {
      const sig = signals[sigId];
      const pinNumber = isLower ? colNum : colNum + colCount;
      const pinParam = pinLegend[pinNumber];
      pinParam.x = x;
      pinParam.y = y;
      pinoutSVGarr.push(keyShapes[pinParam.minifitKey](x, y, pinParam));
      if (!isLower) {
        colNum++;
        x -= gridW;
        y += gridH;
      }
      else {
        y -= gridH;
      }
      isLower = !isLower;
      pinIndex++;
    });
  });
  y = 560;
  Object.entries(pinLegend).forEach(([pinNumber, pinParam]) => {
    pinoutSVGarr.push(pinoutRowTemplate(y, pinParam));
    y += 36;
  });
  return svgTemplate({
    id, notes,
    width: 800,
    height: y + 2 * gridH,
    connectors: pinoutSVGarr.join('\n')
  });
};

const fs = require('fs');
Object.keys(pinouts).forEach(id => {
  fs.writeFileSync(`${id}.svg`, mkSVG(id));
});
