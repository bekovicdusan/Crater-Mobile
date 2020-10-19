import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { styles } from './styles';
import { ListItem, Avatar, CheckBox } from 'react-native-elements';
import { Empty } from '../Empty';
import { colors, fonts } from '@/styles';
import { CurrencyFormat } from '../CurrencyFormat';

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
    listViewContainerStyle: Object
};

export class ListView extends Component<IProps> {
    constructor(props) {
        super(props);
    }

    leftTitle = title => {
        const { leftTitleStyle } = this.props;
        return (
            <Text
                numberOfLines={1}
                style={[styles.leftTitle, leftTitleStyle && leftTitleStyle]}
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
        labelComponent
    } = {}) => {
        const {
            leftSubTitleLabelStyle,
            leftSubTitleStyle,
            leftSubTitleContainerStyle
        } = this.props;
        if (!title && !label && !labelComponent) {
            return;
        }

        return (
            <View style={styles.leftSubTitleContainer}>
                <Text
                    style={[
                        styles.leftSubTitleText,
                        leftSubTitleStyle && leftSubTitleStyle
                    ]}
                    numberOfLines={3}
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
                                { backgroundColor: labelBgColor }
                            ]}
                        >
                            {labelComponent ? (
                                labelComponent
                            ) : (
                                <Text
                                    style={[
                                        { color: labelTextColor },
                                        styles.leftSubTitleLabel,
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
            contentContainerStyle
        } = this.props;
        return (
            <ListItem
                key={index}
                title={this.leftTitle(item.title)}
                subtitle={this.leftSubTitle(item.subtitle)}
                rightTitle={
                    item.amount ? (
                        <CurrencyFormat
                            amount={item.amount}
                            currency={item.currency}
                            style={[
                                styles.rightTitle,
                                rightTitleStyle && rightTitleStyle
                            ]}
                        />
                    ) : (
                        item.rightTitle
                    )
                }
                rightSubtitle={item.rightSubtitle}
                bottomDivider={bottomDivider}
                rightTitleStyle={[
                    styles.rightTitle,
                    rightTitleStyle && rightTitleStyle
                ]}
                rightSubtitleStyle={styles.rightSubTitle}
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
                            colors.veryLightGray
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
                            uncheckedColor={colors.lightGray}
                            checked={this.getCheckedItem(item)}
                            onPress={() => onPress(item.fullItem)}
                        />
                    )
                }
                fontFamily={fonts.poppins}
                onPress={() => onPress(item.fullItem)}
                {...listItemProps}
            />
        );
    };

    itemsWithAvatar = (item, index) => {
        const {
            onPress,
            bottomDivider = false,
            itemContainer,
            listItemProps,
            leftIconStyle
        } = this.props;
        const {
            title,
            subtitle,
            fullItem,
            leftAvatar,
            leftIcon,
            leftIconSolid = false,
            iconSize = 22
        } = item;

        return (
            <ListItem
                key={index}
                title={this.leftTitle(title)}
                subtitle={this.leftSubTitle(subtitle)}
                bottomDivider={bottomDivider}
                containerStyle={[
                    styles.containerWithAvatar,
                    { backgroundColor: colors.veryLightGray },
                    itemContainer && itemContainer
                ]}
                fontFamily={fonts.poppins}
                onPress={() => onPress(fullItem)}
                leftAvatar={
                    leftAvatar ? (
                        <Avatar
                            size={40}
                            rounded
                            title={leftAvatar}
                            overlayContainerStyle={{
                                backgroundColor: leftIcon
                                    ? 'transparent'
                                    : colors.gray
                            }}
                        />
                    ) : (
                        <Icon
                            name={leftIcon}
                            size={iconSize}
                            color={colors.primaryLight}
                            solid={leftIconSolid}
                            style={leftIconStyle && leftIconStyle}
                        />
                    )
                }
                {...listItemProps}
            />
        );
    };

    render() {
        const {
            items,
            hasAvatar = false,
            isEmpty,
            emptyContentProps
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
                    <Empty {...emptyContentProps} />
                )}
            </>
        );
    }
}

export default ListView;
