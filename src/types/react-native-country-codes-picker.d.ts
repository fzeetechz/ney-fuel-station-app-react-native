import {ComponentType} from 'react';
import {TextStyle, ViewStyle} from 'react-native';

export interface CountryItem {
  name: {[language: string]: string};
  dial_code: string;
  code: string;
  flag: string;
}

interface CountryPickerStyle {
  backdrop?: ViewStyle;
  modal?: ViewStyle;
  line?: ViewStyle;
  itemsList?: ViewStyle;
  modalInner?: ViewStyle;
  countryButtonStyles?: ViewStyle;
  countryMessageContainer?: ViewStyle;
  textInput?: TextStyle;
  searchMessageText?: TextStyle;
  flag?: TextStyle;
  dialCode?: TextStyle;
  countryName?: TextStyle;
}

interface CountryPickerProps {
  show: boolean;
  lang?: string;
  initialState?: string;
  inputPlaceholder?: string;
  inputPlaceholderTextColor?: string;
  enableModalAvoiding?: boolean;
  androidWindowSoftInputMode?: string;
  onBackdropPress?: () => void;
  onRequestClose?: () => void;
  pickerButtonOnPress: (item: CountryItem) => void;
  style?: CountryPickerStyle;
}

export const CountryPicker: ComponentType<CountryPickerProps>;
