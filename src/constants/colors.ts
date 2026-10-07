import {fontFamilies} from '../styles/typography';

export const colors = {
  primary: '#E7530D',
  navy: '#102A5E',
  navyDark: '#162F63',
  text: '#151515',
  muted: '#686868',
  border: '#E3E3E8',
  background: '#FCFAFF',
  white: '#FFFFFF',
  dot: '#F1D5C2',
  tabInactive: '#E8E8E8',
  success: '#25AD3B',
  successBackground: '#E5F7E8',
  orderIconBackground: '#E4F6E8',
  trackBackground: '#FBECE3',
  pressed: '#F7F7F7',
  headerBorder: '#41639A',
  quickCard: '#F3F4F7',
  secureBackground: '#DFF1E4',
  amountPreset: '#3E5D8C',
  paymentIcon: '#E8EDF4',
  paymentCardIcon: '#DDF4E3',
  debit: '#EF5B17',
  transactionIcon: '#E9EDF3',
  transactionDebitIcon: '#FBEADE',
  mapBackground: '#E7ECEF',
  mapRoad: '#FFFFFF',
  timelinePending: '#DEDEDE',
  chatIncoming: '#F0EEEE',
  modalBackdrop: 'rgba(8, 20, 45, 0.35)',
} as const;

/** Shared visual tokens. Screens should consume these instead of local hex values. */
export const theme = {
  colors,
  typography: {
    heading: fontFamilies.heading,
    body: fontFamilies.body,
    bodyBold: fontFamilies.bodyBold,
  },
} as const;
