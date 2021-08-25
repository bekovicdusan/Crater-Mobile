import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { ListItem, Avatar, CheckBox } from 'react-native-elements';
import { styles } from './styles';
import { Empty } from '../Empty';
import { colors, fonts } from '@/styles';
import { CurrencyFormat } from '../CurrencyFormat';
import { FadeListAnimation, AssetIcon } from '@/components';
import { isIosPlatform } from '@/constants';
import { isRTL } from '@/utils';
import { Text } from '../Text';
import AssetSvg from '../AssetSvg';
import { AssetImage } from '../AssetImage';

type IProps = {
    hasAvatar: Boolean,
    isEmpty: Boolean,
    containerStyle: Object,
    emptyContentProps: Object,
    rightTitleStyle: Object,
    leftTitleStyle: Object,
    leftSubTitleLabelStyle: Object,
    listItemProps: Object,
    backgroundColor: String,
    compareField: String,
    checkedItems: Array,
    listViewContainerStyle: Object,
    isAnimated?: Boolean,
    parentViewStyle?: any
};

class ListViewComponent extends Component<IProps> {
    constructor(props) {
        super(props);
    }

    leftTitle = title => {
        const { leftTitleStyle, theme } = this.props;
        return (
            <Text
                mediumSize
                numberOfLines={1}
                color={theme?.listItem?.secondary?.color}
                style={leftTitleStyle && leftTitleStyle}
            >
                {title}
            </Text>
        );
    };

    getCheckedItem = item => {
        const { compareField, checkedItems, valueCompareField } = this.props;

        if (checkedItems) {
            return (
                checkedItems.filter(
                    val =>
                        val[valueCompareField] === item.fullItem[compareField]
                ).length > 0
            );
        }

        return false;
    };

    leftSubTitle = ({
        title,
        label,
        labelBgColor,
        labelTextColor,
        labelComponent,
        labelOutlineColor
    } = {}) => {
        const {
            leftSubTitleLabelStyle,
            leftSubTitleStyle,
            leftSubTitleContainerStyle,
            theme
        } = this.props;

        if (!title && !label && !labelComponent) {
            return;
        }

        return (
            <View style={styles.leftSubTitleContainer}>
                <Text
                    h5
                    medium={theme?.mode === 'dark'}
                    style={leftSubTitleStyle && leftSubTitleStyle}
                    numberOfLines={3}
                    color={theme?.listItem?.fourth?.color}
                >
                    {title}
                </Text>

                {(label || labelComponent) && (
                    <View
                        style={[
                            styles.leftSubTitleLabelContainer,
                            leftSubTitleContainerStyle
                        ]}
                    >
                        <View
                            style={[
                                styles.labelInnerContainerStyle,
                                labelBgColor && {
                                    backgroundColor: labelBgColor
                                },
                                labelOutlineColor && {
                                    borderColor: labelOutlineColor
                                },
                                labelOutlineColor && styles.labelOutline
                            ]}
                        >
                            {labelComponent ? (
                                labelComponent
                            ) : (
                                <Text
                                    h6
                                    style={[
                                        { color: labelTextColor },
                                        leftSubTitleLabelStyle &&
                                            leftSubTitleLabelStyle
                                    ]}
                                >
                                    {label}
                                </Text>
                            )}
                        </View>
                    </View>
                )}
            </View>
        );
    };

    getAnimatedItemDelay = index => {
        return index.toString().slice(-1) * 100;
    };

    itemsList = (item, index) => {
        const {
            onPress,
            bottomDivider = false,
            containerStyle,
            rightTitleStyle,
            backgroundColor,
            itemContainer,
            listItemProps,
            hasCheckbox,
            contentContainerStyle,
            isAnimated,
            parentViewStyle,
            rightArrowIcon = false,
            rightArrowIconStyle,
            theme
        } = this.props;

        let otherProps = {};

        if (rightArrowIcon) {
            otherProps = {
                rightAvatar: (
                    <AssetIcon
                        name={!isRTL() ? 'chevron-right' : 'chevron-left'}
                        size={15}
                        color={colors.darkGray}
                        style={rightArrowIconStyle}
                    />
                )
            };
        }

        const children = (
            <ListItem
                key={index}
                title={this.leftTitle(
                    item.title ?? item?.fullItem?.customer?.name
                )}
                subtitle={this.leftSubTitle(item.subtitle)}
                rightTitle={
                    item.amount ? (
                        <CurrencyFormat
                            amount={item.amount}
                            currency={item.currency}
                            style={[
                                styles.rightTitle(theme),
                                rightTitleStyle && rightTitleStyle
                            ]}
                            currencyStyle={{
                                marginTop: isIosPlatform() ? -1.5 : -6
                            }}
                        />
                    ) : (
                        item.rightTitle
                    )
                }
                rightSubtitle={item.rightSubtitle}
                bottomDivider={bottomDivider}
                rightTitleStyle={[
                    styles.rightTitle(theme),
                    rightTitleStyle && rightTitleStyle
                ]}
                rightSubtitleStyle={styles.rightSubTitle(theme)}
                contentContainerStyle={[
                    styles.contentContainer,
                    contentContainerStyle
                ]}
                rightContentContainerStyle={styles.rightContentContainer}
                containerStyle={[
                    styles.containerStyle,
                    {
                        backgroundColor:
                            (backgroundColor && backgroundColor) ||
                            theme?.backgroundColor
                    },
                    itemContainer && itemContainer
                ]}
                leftElement={
                    hasCheckbox && (
                        <CheckBox
                            checkedIcon="check-square"
                            containerStyle={[styles.checkboxContainerStyle]}
                            size={20}
                            checkedColor={colors.primary}
                            uncheckedColor={colors.gray3}
                            checked={this.getCheckedItem(item)}
                            onPress={() => onPress(item.fullItem)}
                        />
                    )
                }
                fontFamily={fonts.poppins}
                onPress={() => onPress(item.fullItem)}
                {...(theme?.mode === 'dark' && {
                    underlayColor: colors.gray
                })}
                {...listItemProps}
                {...otherProps}
            />
        );

        if (isAnimated) {
            return (
                <FadeListAnimation
                    key={index}
                    delay={this.getAnimatedItemDelay(index)}
                >
                    {children}
                </FadeListAnimation>
            );
        }

        if (parentViewStyle) {
            return (
                <View key={index} style={parentViewStyle}>
                    {children}
                </View>
            );
        }

        return children;
    };

    itemsWithAvatar = (item, index) => {
        const {
            onPress,
            bottomDivider = false,
            itemContainer,
            listItemProps,
            leftIconStyle,
            isAnimated,
            rightArrowIcon = false,
            rightArrowIconStyle,
            theme
        } = this.props;
        const {
            title,
            subtitle,
            fullItem,
            leftAvatar,
            leftIcon,
            leftIconSvg,
            leftImage,
            leftIconSolid = false,
            iconSize = 22
        } = item;

        let otherProps = {};

        if (rightArrowIcon) {
            otherProps = {
                rightAvatar: (
                    <AssetIcon
                        name={!isRTL() ? 'chevron-right' : 'chevron-left'}
                        size={15}
                        color={theme?.icons?.primaryColor}
                        style={rightArrowIconStyle}
                    />
                )
            };
        }

        const avatarView = () => (
            <Avatar
                size={40}
                rounded
                title={leftAvatar}
                titleStyle={{ fontWeight: '600' }}
                overlayContainerStyle={{
                    backgroundColor: leftIcon
                        ? 'transparent'
                        : theme?.avatar?.bgColor
                }}
            />
        );

        const assetIconView = () => (
            <AssetIcon
                name={leftIcon}
                size={iconSize}
                color={colors.primaryLight}
                solid={leftIconSolid}
                style={leftIconStyle && leftIconStyle}
            />
        );

        const assetSvgView = () => (
            <View style={[{ paddingLeft: 3 }, leftIconStyle]}>
                <AssetSvg
                    name={leftIconSvg}
                    width={20}
                    height={20}
                    fill={colors.primaryLight}
                />
            </View>
        );

        const assetImageView = () => (
            <AssetImage
                uri
                imageSource={leftImage}
                imageStyle={styles.leftImage(theme)}
                loaderSize="small"
            />
        );

        let leftIconView = null;

        if (leftAvatar) leftIconView = avatarView();
        if (leftIcon) leftIconView = assetIconView();
        if (leftIconSvg) leftIconView = assetSvgView();
        if (leftImage) leftIconView = assetImageView();

        const children = (
            <ListItem
                key={index}
                title={this.leftTitle(title)}
                subtitle={this.leftSubTitle(subtitle)}
                bottomDivider={bottomDivider}
                containerStyle={[
                    styles.containerWithAvatar,
                    { backgroundColor: theme?.backgroundColor },
                    itemContainer && itemContainer
                ]}
                fontFamily={fonts.poppins}
                onPress={() => onPress(fullItem)}
                {...(theme?.mode === 'dark' && {
                    underlayColor: colors.gray
                })}
                leftAvatar={leftIconView}
                {...listItemProps}
                {...otherProps}
            />
        );

        if (isAnimated) {
            return (
                <FadeListAnimation
                    key={index}
                    delay={this.getAnimatedItemDelay(index)}
                >
                    {children}
                </FadeListAnimation>
            );
        }

        return children;
    };

    render() {
        const {
            items,
            hasAvatar = false,
            isEmpty,
            emptyContentProps,
            theme
        } = this.props;

        return (
            <>
                {!isEmpty ? (
                    items.map((item, index) =>
                        !hasAvatar
                            ? this.itemsList(item, index)
                            : this.itemsWithAvatar(item, index)
                    )
                ) : (
                    <Empty {...emptyContentProps} theme={theme} />
                )}
            </>
        );
    }
}

const mapStateToProps = ({ global }) => ({
    theme: global?.theme
});

export const ListView = connect(
    mapStateToProps,
    {}
)(ListViewComponent);
