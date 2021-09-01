// @flow

import React from 'react';
import { View } from 'react-native';
import styles from './styles';
import { ListView, DefaultLayout } from '@/components';
import t from 'locales/use-translation';
import { CUSTOMIZES_MENU } from '../../constants';
import { goBack, MOUNT, UNMOUNT, ROUTES } from '@/navigation';

export class Customizes extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        const { navigation, getCustomizeSettings } = this.props;

        getCustomizeSettings();
        goBack(MOUNT, navigation);
    }

    componentWillUnmount() {
        goBack(UNMOUNT);
    }

    onSelectMenu = ({ route, type = null }) => {
        const { navigation } = this.props;

        if (route) {
            navigation.navigate(route, { type });
        }
    };

    render() {
        const {
            navigation,
            paymentModesLoading,
            itemUnitsLoading,
            theme
        } = this.props;

        let loading = paymentModesLoading || itemUnitsLoading;

        return (
            <DefaultLayout
                headerProps={{
                    leftIconPress: () =>
                        navigation.navigate(ROUTES.SETTING_LIST),
                    title: t('header.customize'),
                    leftArrow: 'primary'
                }}
                hasSearchField={false}
                loadingProps={{ is: loading }}
                bodyStyle="px-0 py-0"
            >
                <View style={styles.listViewContainer}>
                    <ListView
                        items={CUSTOMIZES_MENU()}
                        onPress={this.onSelectMenu}
                        leftTitleStyle={styles.listViewTitle(theme)}
                        rightArrowIcon
                        rightArrowIconStyle={{ marginTop: 5 }}
                    />
                </View>
            </DefaultLayout>
        );
    }
}
