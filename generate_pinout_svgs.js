#!/usr/bin/env node

const title = 'DISTRAP Bus Connector v0.7.1';

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
  'CAN PWR': {
    textColor: '#ffffff',
    bgColor: '#ff3344',
    notes: 'CAN bus power; +5VDC; max 250mA'
  },
  'CAN PWR (optional)': {
    textColor: '#cccccc',
    bgColor: '#ff3344',
    notes: 'CAN bus power: +5V DC; max 250mA; optional'
  },
  '12VDC': {
    bgColor: '#fdff41',
    notes: '+12V DC power; max 5A per pin'
  },
  '24VDC': {
    bgColor: '#6d77ff',
    notes: '+24V DC power; max 5A per pin'
  },
  'GND': {
    textColor: '#ffffff',
    bgColor: '#000000',
    notes: 'Common ground'
  },
  'CAN LO': {
    bgColor: '#c0ffbf',
    notes: 'CAN bus Low signal'
  },
  'CAN HI': {
    bgColor: '#bfffff',
    notes: 'CAN bus High signal'
  },
  'CAN GND': {
    bgColor: '#1a4b19',
    textColor: '#ffffff',
    notes: 'CAN bus GND'
  },
};

const pinouts = {
  '2x2': {
    name: 'Logic',
    notes: '4-pin dual-row MOLEX Micro-Fit (3.0mm pitch); no power rail',
    pinout: [
      ['CAN HI', 'CAN LO'],
      ['CAN PWR (optional)', 'CAN GND'],
    ]
  },
  '2x3': {
    name: 'Power and Logic 24V',
    notes: '6-pin dual-row MOLEX Micro-Fit (3.0mm pitch); 24V 5A (120W) power rail',
    pinout: [
      ['CAN HI', 'CAN LO'],
      ['CAN PWR', 'CAN GND'],
      ['24VDC', 'GND'],
    ]
  },
  '2x4': {
    name: 'Power and Logic 12V',
    notes: '8-pin dual-row MOLEX Micro-Fit (3.0mm pitch); 12V 10A (120W) power rail',
    pinout: [
      ['CAN HI', 'CAN LO'],
      ['CAN PWR', 'CAN GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
    ]
  },
  '2x5': {
    name: 'High Power and Logic 24V',
    notes: '10-pin dual-row MOLEX Micro-Fit (3.0mm pitch); 24V 15A (360W) power rail',
    pinout: [
      ['CAN HI', 'CAN LO'],
      ['CAN PWR', 'CAN GND'],
      ['24VDC', 'GND'],
      ['24VDC', 'GND'],
      ['24VDC', 'GND'],
    ]
  },
  '2x8': {
    name: 'High Power and Logic 12V',
    notes: '16-pin dual-row MOLEX Micro-Fit (3.0mm pitch); 12V 30A (360W) power rail',
    pinout: [
      ['CAN HI', 'CAN LO'],
      ['CAN PWR', 'CAN GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
      ['12VDC', 'GND'],
    ]
  },
};

// key pins:
// 0:   █ square
// 2:   ▜ left
// 3:   ▛ right

const microfitKeys = {
  '2x2': [
    3, 2,
    2, 3,
  ],
  '2x3': [
    2, 3, // 6
    2, 2, // 4
    2, 2, // 2
  ],
  '2x4': [
    2, 2, // 8
    3, 3, // 6
    2, 2, // 4
    3, 0, // 2
  ],
  '2x5': [
    0, 3, // 10
    2, 3, // 8
    2, 3, // 6
    3, 3, // 4
    2, 2, // 2
  ],
  '2x8': [
    3, 3, // 16
    3, 3, // 14
    2, 3, // 12
    2, 2, // 10
    3, 3, // 8
    0, 3, // 6
    3, 2, // 4
    3, 3, // 2
  ]
};
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
  <tspan font-family="HelveticaNeue" font-size="18" fill="#000000">Receptacle, mating side (Plug/header, wire/PCB side)</tspan>
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
  <tspan font-family="HelveticaNeue" font-size="18" fill="#000000">Plug/header, mating side (Receptacle, wire side)</tspan>
</text>`,
};
const keyShapes = [
  // squared (0):
  (x, y, {textColor, bgColor, pinNumber}) => `
<path d="M${x},${y} L${x + 58},${y} L${x + 58},${y + 58} L${x},${y + 58} L${x},${y} z" fill="${bgColor}"/>
<path d="M${x},${y} L${x + 58},${y} L${x + 58},${y + 58} L${x},${y + 58} L${x},${y} z" fill-opacity="0"
      stroke="#333333" stroke-width="1"/>
<text x="${x + 29}" y="${y + 29}" text-anchor="middle" dominant-baseline="middle" dy="0.5em" alignment-baseline="middle">
  <tspan font-family="HelveticaNeue-Bold" font-size="24" fill="${textColor}">${pinNumber}</tspan>
</text>`,
  // notched (1; mini-fit):
  (x, y, {textColor, bgColor, pinNumber}) => `
<path d="M${x},${y} L${x + 58},${y} L${x + 58},${y + 41} L${x + 40},${y + 58} L${x + 17},${y + 58}
      L${x},${y + 41} L${x},${y} z"
      fill="${bgColor}"/>
<path d="M${x},${y} L${x + 58},${y} L${x + 58},${y + 41} L${x + 40},${y + 58} L${x + 17},${y + 58}
      L${x},${y + 41} L${x},${y} z"
      fill-opacity="0" stroke="#333333" stroke-width="1"/>
<text x="${x + 29}" y="${y + 29}" text-anchor="middle" dominant-baseline="middle" dy="0.5em" alignment-baseline="middle">
  <tspan font-family="HelveticaNeue-Bold" font-size="24" fill="${textColor}">${pinNumber}</tspan>
</text>`,
  // left (2; micro-fit):
  (x, y, {textColor, bgColor, pinNumber}) => `
<path d="M${x},${y} L${x + 58},${y} L${x + 58},${y + 41} L${x + 40},${y + 58} L${x},${y + 58} L${x},${y} z"
      fill="${bgColor}"/>
<path d="M${x},${y} L${x + 58},${y} L${x + 58},${y + 41} L${x + 40},${y + 58} L${x},${y + 58} L${x},${y} z"
      fill-opacity="0" stroke="#333333" stroke-width="1"/>
<text x="${x + 29}" y="${y + 29}" text-anchor="middle" dominant-baseline="middle" dy="0.5em" alignment-baseline="middle">
  <tspan font-family="HelveticaNeue-Bold" font-size="24" fill="${textColor}">${pinNumber}</tspan>
</text>`,
  // right (3; micro-fit):
  (x, y, {textColor, bgColor, pinNumber}) => `
<path d="M${x},${y} L${x + 58},${y} L${x + 58},${y + 58} L${x + 17},${y + 58} L${x},${y + 41} L${x},${y} z"
      fill="${bgColor}"/>
<path d="M${x},${y} L${x + 58},${y} L${x + 58},${y + 58} L${x + 17},${y + 58} L${x},${y + 41} L${x},${y} z"
      fill-opacity="0" stroke="#333333" stroke-width="1"/>
<text x="${x + 29}" y="${y + 29}" text-anchor="middle" dominant-baseline="middle" dy="0.5em" alignment-baseline="middle">
  <tspan font-family="HelveticaNeue-Bold" font-size="24" fill="${textColor}">${pinNumber}</tspan>
</text>`,
];

const svgTemplate = ({width, height, id, name, notes, connectors}) => `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     x="0" y="0" width="${width}" height="${height}" viewBox="0, 0, ${width}, ${height}">
<text x="20" y="32">
  <tspan font-family="HelveticaNeue" font-size="24" fill="#000000">${title}</tspan>
</text>
<text x="20" y="62">
  <tspan font-family="HelveticaNeue-Bold" font-size="24" fill="#000000">${name}</tspan>
</text>
<text x="20" y="92">
  <tspan font-family="HelveticaNeue" font-size="18" fill="#000000">${notes}</tspan>
</text>
${connectors}
<text x="20" y="520">
  <tspan font-family="HelveticaNeue-Bold" font-size="24" fill="#000000">Pinout</tspan>
</text>
</svg>
`;

const pinoutRowTemplate = (y, {pinNumber, label, notes, bgColor, textColor}) => `
<circle cx="30" cy="${y - 12}" r="16" fill="${bgColor}" stroke="#333333" stroke-width="2" />
<text x="30" y="${y - 12}" text-anchor="middle" dominant-baseline="middle" dy="0.5em" alignment-baseline="middle">
  <tspan font-family="HelveticaNeue-Bold" font-size="22" fill="${textColor}">${pinNumber}</tspan>
</text>
<text x="54" y="${y - 12}" dominant-baseline="middle" dy="0.5em" alignment-baseline="middle" text-anchor="left">
  <tspan font-family="HelveticaNeue-Bold" font-size="18" fill="#000000">${label}</tspan>
</text>
<text x="240" y="${y - 12}" dominant-baseline="middle" dy="0.5em" alignment-baseline="middle" text-anchor="left">
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
  const name = pinData.name;
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
        microfitKey: microfitKeys[id][pinIndex]
      };
      pinLegend[pinNumber] = pinParam;
      const keyId = pinParam.microfitKey;
      pinoutSVGarr.push(keyShapes[keyId](x, y, pinParam));
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
      let keyId = pinParam.microfitKey;
      if (keyId === 2) {
        keyId = 3;
      }
      else if (keyId === 3) {
        keyId = 2;
      }
      pinoutSVGarr.push(keyShapes[keyId](x, y, pinParam));
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
    id, name, notes,
    width: 800,
    height: y + 2 * gridH,
    connectors: pinoutSVGarr.join('\n')
  });
};

const fs = require('fs');
Object.keys(pinouts).forEach(id => {
  fs.writeFileSync(`${id}.svg`, mkSVG(id));
});
