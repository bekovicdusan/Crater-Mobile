// @flow

import React from 'react';
import { View, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import { styles, Container } from './styles';
import { InputField, CtHeader, CtDivider } from '../..';
import { Content } from '../../Content';
import t from 'locales/use-translation';
import { Toast } from '@/components';
import { STATUS_BAR_CONTENT } from '@/utils';
import { View as CtView, CtDecorativeButton } from '@/components';
import { AssetIcon } from '@/components/AssetIcon';
import { Filter } from '@/components/Filter';
import CompanyModal from '@/features/common/containers/CompanyModal';
import { isIPhoneX } from '@/constants';

interface IProps {
    children: any;
    headerProps?: any;
    onSearch?: Function;
    bottomDivider?: Boolean;
    hasSearchField?: Boolean;
    onToggleFilter?: Function;
    filterProps?: Object;
    inputProps?: Object;
    dividerStyle?: Object;
    loadingProps?: Object;
    searchFieldProps?: any;
    toastProps?: any;
}

const Layout = (props: IProps) => {
    const {
        children,
        headerProps,
        onSearch,
        bottomDivider,
        hasSearchField = true,
        bottomAction,
        filterProps,
        inputProps,
        dividerStyle,
        loadingProps,
        searchFieldProps,
        toastProps,
        plusButtonOnPress,
        theme
    } = props;

    let bodyStyle = {};

    if (props?.bodyStyle) {
        props?.bodyStyle.split(' ').map(property => {
            if (property === 'is-full-listView') {
                bodyStyle = {
                    ...bodyStyle,
                    [`pb-${isIPhoneX() ? 30 : 0}`]: true
                };
                return;
            }

            bodyStyle = { ...bodyStyle, [property]: true };
        });
    }

    return (
        <>
            <Container>
                <StatusBar
                    barStyle={STATUS_BAR_CONTENT[(theme?.mode)]}
                    hidden={false}
                    translucent={true}
                    backgroundColor={theme?.backgroundColor}
                />

                <View style={styles.content}>
                    <CtHeader
                        titleStyle={{
                            ...styles.headerTitleStyle(
                                theme,
                                headerProps?.leftIcon ||
                                    headerProps?.leftIconPress
                            ),
                            ...headerProps?.withTitleStyle
                        }}
                        placement="left"
                        transparent
                        noBorder
                        hasCircle
                        {...((headerProps?.leftIcon ||
                            headerProps?.leftIconPress) && {
                            leftArrow: 'secondary'
                        })}
                        containerStyle={styles.header}
                        {...headerProps}
                        theme={theme}
                        filterProps={
                            !props?.['with-input-filter'] && filterProps
                        }
                        {...(props?.['with-company'] && {
                            rightComponent: (
                                <CompanyModal navigation={props?.navigation} />
                            )
                        })}
                    />

                    {hasSearchField && (
                        <View style={styles.searchFieldContainer}>
                            <Field
                                name="search"
                                component={InputField}
                                inputProps={{
                                    returnKeyType: 'next',
                                    autoCapitalize: 'none',
                                    placeholder: t('search.title'),
                                    autoCorrect: true,
                                    ...(filterProps &&
                                        props?.['with-input-filter'] && {
                                            rightIcon: (
                                                <Filter
                                                    {...filterProps}
                                                    theme={theme}
                                                    is-small
                                                />
                                            )
                                        }),
                                    ...inputProps
                                }}
                                onChangeText={onSearch}
                                height={40}
                                rounded
                                fieldStyle={{
                                    ...styles.inputField,
                                    ...searchFieldProps?.inputFieldStyle
                                }}
                                {...searchFieldProps}
                            />
                        </View>
                    )}

                    {bottomDivider && (
                        <CtDivider
                            dividerStyle={dividerStyle && dividerStyle}
                            theme={theme}
                        />
                    )}

                    <Content loadingProps={loadingProps} theme={theme}>
                        <CtView flex={1} {...bodyStyle}>
                            {children}
                        </CtView>
                    </Content>
                </View>

                {bottomAction && (
                    <View style={styles.bottomView(theme)}>{bottomAction}</View>
                )}

                {toastProps && (
                    <Toast containerStyle={{ bottom: 20 }} {...toastProps} />
                )}
            </Container>
            {plusButtonOnPress ? (
                <View style={styles.floatingActionView}>
                    <CtDecorativeButton
                        justify-center
                        items-center
                        background-color={theme?.icons.circle.backgroundColor}
                        style={styles.floatingAction(theme)}
                        onPress={plusButtonOnPress}
                        withHitSlop
                        scale={1}
                    >
                        <AssetIcon
                            name={'plus'}
                            size={20}
                            style={{
                                color: theme?.icons?.plus?.backgroundColor
                            }}
                        />
                    </CtDecorativeButton>
                </View>
            ) : null}
        </>
    );
};

const mapStateToProps = ({ global }) => ({
    locale: global?.locale,
    theme: global?.theme
});

//  connect
export const MainLayout = connect(
    mapStateToProps,
    {}
)(Layout);
