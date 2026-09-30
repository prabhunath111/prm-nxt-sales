import { DimensionValue, Dimensions } from 'react-native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('screen');
type Screen = 'width' | 'height';
export const screen: Record<Screen, number> = {
  width: screenWidth,
  height: screenHeight,
};

type Layout =
  | 'x0'
  | 'xDot1'
  | 'xDot5'
  | 'xDot6'
  | 'xDot7Dot5'
  | 'x1'
  | 'x1Dot5'
  | 'x2'
  | 'x3'
  | 'x4'
  | 'x5'
  | 'x5Dot5'
  | 'x6'
  | 'x7'
  | 'x8'
  | 'x9'
  | 'x10'
  | 'x11'
  | 'x12'
  | 'x13'
  | 'x14'
  | 'x15'
  | 'x16'
  | 'x18'
  | 'x19'
  | 'x20'
  | 'x21'
  | 'x22'
  | 'x24'
  | 'x25'
  | 'x26'
  | 'x30'
  | 'x32'
  | 'x34'
  | 'x35'
  | 'x36'
  | 'x38'
  | 'x40'
  | 'x43'
  | 'x45'
  | 'x48'
  | 'x50'
  | 'x52'
  | 'x56'
  | 'x60'
  | 'x65'
  | 'x70'
  | 'x75'
  | 'x80'
  | 'x85'
  | 'x90'
  | 'x100'
  | 'x110'
  | 'x120'
  | 'x130'
  | 'x140'
  | 'x145'
  | 'x150'
  | 'x155'
  | 'x159'
  | 'x165'
  | 'x167Dot5'
  | 'x170'
  | 'x180'
  | 'x200'
  | 'x210'
  | 'x218'
  | 'x230'
  | 'x250'
  | 'x256'
  | 'x260'
  | 'x300'
  | 'x305'
  | 'x311'
  | 'x328'
  | 'x320'
  | 'x330'
  | 'x350'
  | 'x360'
  | 'x379'
  | 'x400'
  | 'x435'
  | 'x450'
  | 'x470'
  | 'x480'
  | 'x500'
  | 'x520'
  | 'x550'
  | 'x580'
  | 'x600'
  | 'x660'
  | 'x700'
  | 'x720'
  | 'x800'
  | 'x1000'
  | 'x1024'
  | 'x3000'
  | 'x5000';
export const layout: Record<Layout, number> = {
  x0: 0,
  xDot1: 0.1,
  xDot5: 0.5,
  xDot6: 0.6,
  xDot7Dot5: 0.75,
  x1: 1,
  x1Dot5: 1.5,
  x2: 2,
  x3: 3,
  x4: 4,
  x5: 5,
  x5Dot5: 5.5,
  x6: 6,
  x7: 7,
  x8: 8,
  x9: 9,
  x10: 10,
  x11: 11,
  x12: 12,
  x13: 13,
  x14: 14,
  x15: 15,
  x16: 16,
  x18: 18,
  x19: 19,
  x20: 20,
  x21: 21,
  x22: 22,
  x24: 24,
  x25: 25,
  x26: 26,
  x30: 30,
  x32: 32,
  x34: 34,
  x35: 35,
  x36: 36,
  x38: 38,
  x40: 40,
  x43: 43,
  x45: 45,
  x48: 48,
  x50: 50,
  x52: 52,
  x56: 56,
  x60: 60,
  x65: 65,
  x70: 70,
  x75: 75,
  x80: 80,
  x85: 85,
  x90: 90,
  x100: 100,
  x110: 110,
  x120: 120,
  x130: 130,
  x140: 140,
  x145: 145,
  x150: 150,
  x155: 155,
  x159: 159,
  x165: 165,
  x167Dot5: 167.5,
  x170: 170,
  x180: 180,
  x200: 200,
  x210: 210,
  x218: 218,
  x230: 230,
  x250: 250,
  x256: 256,
  x260: 260,
  x300: 300,
  x320: 320,
  x330: 330,
  x305: 305,
  x311: 311,
  x328: 328,
  x350: 350,
  x360: 360,
  x379: 379,
  x450: 450,
  x400: 450,
  x435: 435,
  x470: 470,
  x480: 480,
  x500: 500,
  x520: 520,
  x550: 550,
  x580: 580,
  x600: 600,
  x660: 660,
  x700: 700,
  x720: 720,
  x800: 800,
  x1000: 1000,
  x1024: 1024,
  x3000: 3000,
  x5000: 5000,
};

export const { xDot5 } = layout;
export const { xDot6 } = layout;
export const { x0 } = layout;
export const { x1 } = layout;
export const { x2 } = layout;
export const { x3 } = layout;
export const { x4 } = layout;
export const { x5 } = layout;
export const { x5Dot5 } = layout;
export const { x6 } = layout;
export const { x7 } = layout;
export const { x8 } = layout;
export const { x9 } = layout;
export const { x10 } = layout;
export const { x11 } = layout;
export const { x13 } = layout;
export const { x14 } = layout;
export const { x15 } = layout;
export const { x16 } = layout;
export const { x18 } = layout;
export const { x20 } = layout;
export const { x21 } = layout;
export const { x22 } = layout;
export const { x24 } = layout;
export const { x25 } = layout;
export const { x30 } = layout;
export const { x32 } = layout;
export const { x34 } = layout;
export const { x35 } = layout;
export const { x36 } = layout;
export const { x38 } = layout;
export const { x40 } = layout;
export const { x43 } = layout;
export const { x48 } = layout;
export const { x50 } = layout;
export const { x52 } = layout;
export const { x56 } = layout;
export const { x60 } = layout;
export const { x70 } = layout;
export const { x75 } = layout;
export const { x80 } = layout;
export const { x85 } = layout;
export const { x90 } = layout;
export const { x100 } = layout;
export const { x110 } = layout;
export const { x120 } = layout;
export const { x130 } = layout;
export const { x140 } = layout;
export const { x159 } = layout;
export const { x170 } = layout;
export const { x200 } = layout;
export const { x210 } = layout;
export const { x250 } = layout;
export const { x256 } = layout;
export const { x300 } = layout;
export const { x311 } = layout;
export const { x328 } = layout;
export const { x350 } = layout;
export const { x360 } = layout;
export const { x379 } = layout;
export const { x400 } = layout;
export const { x500 } = layout;
export const { x550 } = layout;
export const { x600 } = layout;
export const { x720 } = layout;
export const { x1000 } = layout;
export const { x3000 } = layout;

type Icons = 'x10' | 'x15' | 'x20' | 'x25' | 'x30' | 'x40';
export const icons: Record<Icons, number> = {
  x10: 10,
  x15: 15,
  x20: 20,
  x25: 25,
  x30: 30,
  x40: 40,
};

type IconStroke = 'x1' | 'x2';
export const iconStroke: Record<IconStroke, number> = {
  x1: 1,
  x2: 2,
};

type LayoutP =
  | 'xp1'
  | 'xp2'
  | 'xp3'
  | 'xp4'
  | 'xp5'
  | 'xp6'
  | 'xp8'
  | 'xp10'
  | 'xp18'
  | 'xp15'
  | 'xp20'
  | 'xp23'
  | 'xp25'
  | 'xp27'
  | 'xp30'
  | 'xp32'
  | 'xp33'
  | 'xp35'
  | 'xp40'
  | 'xp45'
  | 'xp48'
  | 'xp49'
  | 'xp50'
  | 'xp54'
  | 'xp55'
  | 'xp60'
  | 'xp70'
  | 'xp75'
  | 'xp80'
  | 'xp85'
  | 'xp88'
  | 'xp90'
  | 'xp95'
  | 'xp98'
  | 'xp100';

export const layoutP: Record<LayoutP, DimensionValue> = {
  xp1: '1%',
  xp2: '2%',
  xp3: '3%',
  xp4: '4%',
  xp5: '5%',
  xp6: '6%',
  xp8: '8%',
  xp10: '10%',
  xp15: '15%',
  xp18: '18%',
  xp20: '20%',
  xp23: '23%',
  xp25: '25%',
  xp27: '27%',
  xp30: '30%',
  xp32: '32%',
  xp33: '33%',
  xp35: '35%',
  xp40: '40%',
  xp45: '45%',
  xp48: '48%',
  xp49: '49%',
  xp50: '50%',
  xp54: '54%',
  xp55: '55%',
  xp60: '60%',
  xp70: '70%',
  xp75: '75%',
  xp80: '80%',
  xp85: '85%',
  xp88: '88%',
  xp90: '90%',
  xp95: '95%',
  xp98: '98%',
  xp100: '100%',
};

export const { xp2 } = layoutP;
export const { xp3 } = layoutP;
export const { xp4 } = layoutP;
export const { xp5 } = layoutP;
export const { xp10 } = layoutP;
export const { xp25 } = layoutP;
export const { xp30 } = layoutP;
export const { xp35 } = layoutP;
export const { xp50 } = layoutP;
export const { xp40 } = layoutP;
export const { xp60 } = layoutP;
export const { xp70 } = layoutP;
export const { xp75 } = layoutP;
export const { xp80 } = layoutP;
export const { xp85 } = layoutP;
export const { xp90 } = layoutP;
export const { xp95 } = layoutP;
export const { xp100 } = layoutP;

type FlexSize = 'x0' | 'x10' | 'x20' | 'x30' | 'x32' | 'x35' | 'x40' | 'x50' | 'x60' | 'x65' | 'x70' | 'x100';
export const flexSize: Record<FlexSize, number> = {
  x0: 0,
  x10: 0.1,
  x20: 0.2,
  x30: 0.3,
  x32: 0.32,
  x35: 0.35,
  x40: 0.4,
  x50: 0.5,
  x60: 0.6,
  x65: 0.65,
  x70: 0.7,
  x100: 1,
};

type ShadowOpacity = 'x12' | 'x14';
export const shadowOpacity: Record<ShadowOpacity, number> = {
  x12: 0.12,
  x14: 0.14,
};
