import React, {Component} from 'react';
import {Text} from '../Text';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {formatMoney, definePlatformParam, isIosPlatform} from '@/constants';

export class CurrencyFormat extends Component<IProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      style,
      amount,
      currency,
      preText,
      containerStyle,
      currencyStyle,
      moneyStyle,
      symbolStyle,
      currencySymbolStyle
    } = this.props;
    const {symbol, money, swap_currency_symbol} = formatMoney(amount, currency);
    const combinedSymbolStyle = [
      style && style,
      currencyStyle && currencyStyle,
      SymbolStyle
    ];
    const combinedMoneyStyle = [style, moneyStyle];

    let firstComponent = swap_currency_symbol ? money : symbol;
    let firstComponentStyle = swap_currency_symbol
      ? combinedMoneyStyle
      : combinedSymbolStyle;
    let secondComponent = swap_currency_symbol ? symbol : money;
    let secondComponentStyle = swap_currency_symbol
      ? combinedSymbolStyle
      : combinedMoneyStyle;

    return (
      <View style={[styles.container, containerStyle && containerStyle]}>
        <Text numberOfLines={1} style={style && style}>
          {preText && preText}
        </Text>
        <Text
          numberOfLines={1}
          style={[firstComponentStyle, styles.symbol, symbolStyle]}
        >
          {`${firstComponent} `}
        </Text>
        <Text
          numberOfLines={1}
          style={[secondComponentStyle, currencySymbolStyle]}
        >
          {secondComponent}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  symbol: {
    ...(isIosPlatform && {marginBottom: -2})
  }
});

export const SymbolStyle = {
  fontFamily: definePlatformParam('Arial', 'sans-serif')
};

interface IProps {
  /**
   * The style of the content container(View).
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
   * The style of the content container(View).
   */
  containerStyle?: StyleProp<ViewStyle> | any;

  /**
   * The style of the content container(Currency).
   */
  currencyStyle?: StyleProp<ViewStyle> | any;

  /**
   * The style of the content container(Currency-View-Symbol).
   */
  currencySymbolStyle?: StyleProp<ViewStyle> | any;

  /**
   * The style of the content container(Amount-View).
   */
  moneyStyle?: StyleProp<ViewStyle> | any;

  /**
   * The style of the content container(Symbol-View).
   */
  symbolStyle?: StyleProp<ViewStyle> | any;
}
