import type {Address} from '../services/addressServices';

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Success: undefined;
  Home: undefined;
  Order: undefined;
  OrdersHistory: undefined;
  ReviewOrder: undefined;
  Wallet: undefined;
  AddMoney: undefined;
  AllTransactions: undefined;
  TrackOrder: undefined;
  Profile: undefined;
  MyAddress: undefined;
  AddAddress: {address?: Address} | undefined;
};
