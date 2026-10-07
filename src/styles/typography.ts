import {FONT} from '../assets/font';

export const fontFamilies = {
  heading: FONT.SpaceGroteskBold,
  body: FONT.NeueMontrealRegular,
  bodyBold: FONT.SpaceGroteskBold,
} as const;

export const typography = {
  heading: {
    fontFamily: fontFamilies.heading,
  },
  body: {
    fontFamily: fontFamilies.body,
  },
} as const;
