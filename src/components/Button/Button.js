// @flow

import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './styles';
import { colors } from '@/styles';
import { Button } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { AssetImage } from '../AssetImage';
import { BUTTON_COLOR, BUTTON_TYPE } from '@/constants';

type IProps = {
    children?: any,
    onPress?: Function,
    loading?: boolean,
    disabled?: boolean,
    whiteButton?: boolean,
    style?: Object,
    iconPlacement?: any,
    btnTitle?: String,
    type?: String,
    iconName?: String,
    imageIcon?: Boolean,
    isGradient?: Boolean,
    raised?: Boolean,
    imageSource?: String | any,
    buttonType?: String,
    containerStyle?: Object
};
export class CtGradientButton extends Component<IProps> {
    constructor(props) {
        super(props);
        this.state = {
            buttonFocus: false,
            animatedScale: new Animated.Value(1)
        };
    }

    componentWillUpdate(nextProps, nextState) {
        const { loading } = nextProps;
        const { buttonFocus } = nextState;

        if (!loading && buttonFocus) {
            this.setState({ buttonFocus: false });
        }
    }

    onBtnPress = () => {
        this.setState({ buttonFocus: true });
        this.props?.onPress?.();
    };

    toggleAnimatedScale = (toValue = 0.98) => {
        Animated.timing(this.state.animatedScale, {
            toValue,
            duration: 100,
            useNativeDriver: true
        }).start();
    };

    render() {
        const {
            style,
            iconPlacement,
            type = 'solid',
            loading = false,
            btnTitle,
            iconName,
            imageIcon = false,
            imageSource,
            raised,
            buttonColor = BUTTON_COLOR.PRIMARY,
            containerStyle,
            buttonContainerStyle,
            hasFocus = true
        } = this.props;

        const { buttonFocus, animatedScale } = this.state;
        const isOutline = type === BUTTON_TYPE.OUTLINE;
        const animatedStyle = {
            transform: [{ scale: animatedScale }]
        };

        return (
            <Animated.View
                style={[
                    animatedStyle,
                    styles.buttonContainer,
                    buttonContainerStyle
                ]}
            >
                <Button
                    icon={
                        imageIcon ? (
                            <AssetImage
                                imageSource={imageSource}
                                imageStyle={styles.imageIcon}
                            />
                        ) : (
                            <Icon
                                name={iconName}
                                size={15}
                                color={colors.white}
                            />
                        )
                    }
                    {...iconPlacement}
                    containerStyle={[
                        styles.containerStyle,
                        raised && styles.containerShadow,
                        containerStyle && containerStyle,
                        hasFocus &&
                            buttonFocus && {
                                borderColor: colors[`${buttonColor}Light`]
                            }
                    ]}
                    buttonStyle={[
                        styles.buttonStyle,
                        style,
                        isOutline
                            ? [
                                  { borderColor: colors[buttonColor] },
                                  styles.buttonOutline
                              ]
                            : {
                                  backgroundColor: colors[buttonColor],
                                  borderColor: colors[buttonColor]
                              }
                    ]}
                    onPress={() => this.onBtnPress()}
                    onPressIn={() => this.toggleAnimatedScale()}
                    onPressOut={() => this.toggleAnimatedScale(1)}
                    type={type}
                    title={btnTitle}
                    titleStyle={[
                        styles.titleStyle,
                        isOutline && {
                            color: colors[buttonColor]
                        }
                    ]}
                    loading={loading && buttonFocus}
                    loadingStyle={{ opacity: 0.7 }}
                    loadingProps={{ color: colors.darkGray }}
                    linearGradientProps={{
                        colors: [colors.primary, colors.primaryLight],
                        start: { x: 0, y: 0.5 },
                        end: { x: 1, y: 0.5 }
                    }}
                    disabled={loading}
                    disabledStyle={[
                        styles.buttonStyle,
                        style,
                        isOutline
                            ? [
                                  { borderColor: colors[buttonColor] },
                                  styles.buttonOutline
                              ]
                            : {
                                  backgroundColor: colors[buttonColor],
                                  borderColor: colors[buttonColor],
                                  opacity: 0.7
                              }
                    ]}
                    disabledTitleStyle={
                        (styles.titleStyle,
                        {
                            color: isOutline
                                ? colors[buttonColor]
                                : colors.white
                        })
                    }
                    ViewComponent={LinearGradient}
                />
            </Animated.View>
        );
    }
}

export class CtButton extends Component<IProps> {
    constructor(props) {
        super(props);
        this.state = {
            buttonFocus: false,
            animatedScale: new Animated.Value(1)
        };
    }

    componentWillUpdate(nextProps, nextState) {
        const { loading } = nextProps;
        const { buttonFocus } = nextState;

        if (!loading && buttonFocus) {
            this.setState({ buttonFocus: false });
        }
    }

    onBtnPress = () => {
        this.setState({ buttonFocus: true });
        this.props?.onPress?.();
    };

    toggleAnimatedScale = (toValue = 0.98) => {
        Animated.timing(this.state.animatedScale, {
            toValue,
            duration: 100,
            useNativeDriver: true
        }).start();
    };

    render() {
        const {
            style,
            iconPlacement,
            type = 'solid',
            loading = false,
            isLoading = false,
            btnTitle,
            iconName,
            imageIcon = false,
            imageSource,
            raised,
            buttonColor = BUTTON_COLOR.PRIMARY,
            containerStyle,
            buttonContainerStyle,
            hasFocus = true
        } = this.props;

        const { buttonFocus, animatedScale } = this.state;
        const isOutline = type === BUTTON_TYPE.OUTLINE;
        const animatedStyle = {
            transform: [{ scale: animatedScale }]
        };

        return (
            <Animated.View
                style={[
                    animatedStyle,
                    styles.buttonContainer,
                    buttonContainerStyle
                ]}
            >
                <Button
                    icon={
                        imageIcon ? (
                            <AssetImage
                                imageSource={imageSource}
                                imageStyle={styles.imageIcon}
                            />
                        ) : (
                            <Icon
                                name={iconName}
                                size={15}
                                color={colors.white}
                            />
                        )
                    }
                    {...iconPlacement}
                    containerStyle={[
                        styles.containerStyle,
                        raised && styles.containerShadow,
                        containerStyle && containerStyle,
                        hasFocus &&
                            buttonFocus && {
                                borderColor: colors[`${buttonColor}Light`]
                            }
                    ]}
                    buttonStyle={[
                        styles.buttonStyle,
                        style,
                        isOutline
                            ? [
                                  { borderColor: colors[buttonColor] },
                                  styles.buttonOutline
                              ]
                            : {
                                  backgroundColor: colors[buttonColor],
                                  borderColor: colors[buttonColor]
                              }
                    ]}
                    onPress={() => this.onBtnPress()}
                    onPressIn={() => this.toggleAnimatedScale()}
                    onPressOut={() => this.toggleAnimatedScale(1)}
                    type={type}
                    title={btnTitle}
                    loading={(loading && buttonFocus) || isLoading}
                    loadingStyle={{ opacity: 0.7 }}
                    loadingProps={{
                        color: !isOutline ? colors.white : colors[buttonColor]
                    }}
                    titleStyle={[
                        styles.titleStyle,
                        isOutline && {
                            color: colors[buttonColor]
                        }
                    ]}
                    disabled={loading}
                    disabledStyle={[
                        styles.buttonStyle,
                        style,
                        isOutline
                            ? [
                                  { borderColor: colors[buttonColor] },
                                  styles.buttonOutline
                              ]
                            : {
                                  backgroundColor: colors[buttonColor],
                                  borderColor: colors[buttonColor],
                                  opacity: 0.7
                              }
                    ]}
                    disabledTitleStyle={
                        (styles.titleStyle,
                        {
                            color: isOutline
                                ? colors[buttonColor]
                                : colors.white
                        })
                    }
                />
            </Animated.View>
        );
    }
}
