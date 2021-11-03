import {StyleProp, ViewStyle} from 'react-native';

export interface IProps {
  /**
   * Styling for main container.
   */
  style?: StyleProp<ViewStyle> | any;

  /**
   * The price of an active item.
   */
  amount: number;

  /**
   * Selected company currency.
   */
  currency: any;

  /**
   * The text to shown on the left side of the currency.
   */
  preText: string;

  /**
   * Styling for main container.
   */
  containerStyle?: StyleProp<ViewStyle> | any;

  /**
   * Styles for the container surrounding the currency.
   */
  currencyStyle?: StyleProp<ViewStyle> | any;

  /**
   * Styles for the container surrounding the currency symbol.
   */
  currencySymbolStyle?: StyleProp<ViewStyle> | any;

  /**
   * Styles for the container surrounding the money.
   */
  moneyStyle?: StyleProp<ViewStyle> | any;

  /**
   * Styles for the container surrounding the symbol.
   */
  symbolStyle?: StyleProp<ViewStyle> | any;
}
