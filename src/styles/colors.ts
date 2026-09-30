type Neutral =
  | 'white'
  | 'g20'
  | 'g50'
  | 'g60'
  | 'g70'
  | 'g100'
  | 'g150'
  | 'g200'
  | 'g250'
  | 'g300'
  | 'g350'
  | 'g400'
  | 'g450'
  | 'g500'
  | 'g600'
  | 'g550'
  | 'g600'
  | 'g650'
  | 'g700'
  | 'g750'
  | 'g800'
  | 'g850'
  | 'black'
  | 'g900';
export const neutral: Record<Neutral, string> = {
  white: '#ffffff',
  g20: '#FCFCFC',
  g50: '#F8F6F6',
  g60: '#707070',
  g70: '#FDF4F9',
  g100: '#EFEFEF',
  g150: '#E6E6E6',
  g200: '#DCDCDC',
  g250: '#E8E5EC',
  g300: '#C2C2C2',
  g350: '#DDDDDD',
  g400: '#C4C4C4',
  g450: '#C8C8C8',
  g500: '#9f9ea4',
  g550: '#444444',
  g600: '#666666',
  g650: '#CCCCCC',
  g700: '#545454',
  g750: '#424242',
  g800: '#212123',
  g850: '#888888',
  black: '#000000',
  g900: '#eee',
};

type Violet =
  | 'lightViolet'
  | 'v50'
  | 'v100'
  | 'v150'
  | 'v200'
  | 'v250'
  | 'v300'
  | 'v350'
  | 'v400'
  | 'v450'
  | 'v500'
  | 'v550'
  | 'darkViolet'
  | 'borderGrey'
  | 'backgroundViolet'
  | 'violetPink'
  | 'v600';
export const violet: Record<Violet, string> = {
  lightViolet: '#FBF8FF',
  v50: '#F3F2F5',
  v100: '#F7F4FC',
  v150: '#FAEAF4',
  v250: '#564372',
  v200: '#C7C0D0',
  v300: '#8E81A1',
  v350: '#907FA2',
  v400: '#564372',
  v450: '#EFE8FB',
  v500: '#8856DF',
  v550: '#6B00DE',
  darkViolet: '#220046',
  borderGrey: '#E8E5EC',
  backgroundViolet: '#220046cc',
  violetPink: '#E10092',
  v600: '#2d0a4e',
};

type AppColors =
  | 'lensFlareGreen'
  | 'green'
  | 'midGreen'
  | 'darkGreen'
  | 'red'
  | 'lightRed'
  | 'frenchViolet'
  | 'violet'
  | 'darkViolet'
  | 'lightViolet'
  | 'blueViolet'
  | 'v200'
  | 'v800'
  | 'pink400'
  | 'lightPink'
  | 'paleBlue'
  | 'indigo'
  | 'dullLavender'
  | 'pink'
  | 'lightPurple'
  | 'activeGreen'
  | 'activeGreenBackground'
  | 'pendingYellow'
  | 'pendingYellowBackground'
  | 'indogo500'
  | 'hotPink'
  | 'paleYellow'
  | 'lightYellow';

export const appColors: Record<AppColors, string> = {
  lensFlareGreen: '#B1FFA2',
  green: '#16D45A',
  midGreen: '#009E35',
  darkGreen: '#29d939',
  red: '#FF2424',
  lightRed: '#E24C4B',
  violet: '#9E48F9',
  frenchViolet: '#6F19D9',
  darkViolet: '#220046',
  lightViolet: '#FBF8FF',
  blueViolet: '#806B98',
  v200: '#F7F4FC',
  v800: '#564372',
  lightPurple: '#6B00DD',
  lightPink: '#DB62AB',
  pink400: '#F3CBE3',
  paleBlue: '#ACCAF1',
  indigo: '#390175',
  dullLavender: '#AF8EE9',
  indogo500: '#5001A4',
  pink: '#E10092',
  activeGreen: '#057056',
  activeGreenBackground: '#D7F9F0',
  pendingYellow: '#D18F0E',
  pendingYellowBackground: '#FFF0CA',
  hotPink: '#ec1A63',
  paleYellow: '#FFC24A',
  lightYellow: '#ffe0a5',
};

type Gradient = 'theme' | 'pinkGradient' | 'buttonGradient' | 'mobileHomeGradient' | 'cardTheme' | 'dashboardGradient' | 'summaryGradient';

export const gradient: Record<Gradient, string[]> = {
  theme: ['#8f2e7f', '#653e8b', '#4c438c', '#31468a', '#31468a'],
  pinkGradient: ['#e0c3fd', '#F6F4F9', '#F6F4F9', '#F6F4F9', '#F6F4F9'],
  buttonGradient: ['#E10092', '#CB0284'],
  mobileHomeGradient: ['#220046', '#220046', '#220046', '#E10092'],
  cardTheme: ['#6B00DD', '#220046'],
  dashboardGradient: ['#220046', '#220046', '#E10092'],
  summaryGradient: ['#C9B3D9', '#C9B3D9', '#C9B3D9', '#F7F4FC'],
};
type Primary = 'brand' | 'theme';
export const primary: Record<Primary, string> = {
  brand: '#E20092',
  theme: '#6B00DE',
};

type Secondary = 'brand' | 'theme';
export const secondary: Record<Secondary, string> = {
  brand: '#AD60FF',
  theme: '#5F08BC',
};

type Error = 'primary';
export const error: Record<Error, string> = {
  primary: '#E24C4B',
};

type Success = 'primary';
export const success: Record<Success, string> = {
  primary: '#adffad',
};

type Warning = 'primary';
export const warning: Record<Warning, string> = {
  primary: '#ffd557',
};

type Info = 'primary';
export const info: Record<Info, string> = {
  primary: '#75c8ff',
};

const applyOpacity = (hexColor: string, opacity: number): string => {
  const red = parseInt(hexColor.slice(1, 3), 16);
  const green = parseInt(hexColor.slice(3, 5), 16);
  const blue = parseInt(hexColor.slice(5, 7), 16);

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
};

type Transparent = 'clear' | 'lightGray' | 'darkGray' | 'black';
export const transparent: Record<Transparent, string> = {
  clear: 'rgba(255, 255, 255, 0)',
  lightGray: applyOpacity(neutral.g500, 0.4),
  darkGray: applyOpacity(neutral.g800, 0.8),
  black: applyOpacity(neutral.black, 0.8),
};

export const shadeColor = (hexColor: string, percent: number): string => {
  const redGamut: number = parseInt(hexColor.slice(1, 3), 16);
  const greenGamut: number = parseInt(hexColor.slice(3, 5), 16);
  const blueGamut: number = parseInt(hexColor.slice(5, 7), 16);

  const rgb: Array<number> = [redGamut, greenGamut, blueGamut];

  const toShadedGamut = (gamut: number): number => Math.floor(Math.min(gamut * (1 + percent / 100), 255));

  const toHex = (gamut: number): string => (gamut.toString(16).length === 1 ? `0${gamut.toString(16)}` : gamut.toString(16));

  const shadedRGB: Array<number> = rgb.map(toShadedGamut);
  const shadedHex: Array<string> = shadedRGB.map(toHex);

  const hexString: string = shadedHex.join('');

  return `#${hexString}`;
};
