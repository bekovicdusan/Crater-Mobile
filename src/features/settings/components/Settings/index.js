// @flow

import React from 'react';
import styles from './styles';
import {ListView, DefaultLayout} from '@/components';
import t from 'locales/use-translation';
import {SETTINGS_MENU} from '../../constants';
import {routes} from '@/navigation';

export class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      endpointVisible: false
    };
  }

  onSelectMenu = item => {
    const {navigation} = this.props;

    if (item.route) {
      item.route === routes.ENDPOINTS_SETTINGS
        ? navigation.navigate(item.route, {skipEndpoint: true})
        : navigation.navigate(item.route);
    } else {
      this[item.action]();
    }
  };

  onLogout = () => {
    const {navigation, logout} = this.props;
    logout({navigation});
  };

  render() {
    const {navigation, theme} = this.props;
    const settingList = [];
    SETTINGS_MENU().map(list => {
      list?.show && settingList.push(list);
    });

    return (
      <DefaultLayout
        headerProps={{
          leftIconPress: () => navigation.navigate(routes.MAIN_MORE),
          title: t('header.settings'),
          leftIconStyle: {color: theme?.header?.primary?.color}
        }}
        hasSearchField={false}
        bodyStyle="px-0 pt-12 pb-17"
      >
        <ListView
          items={settingList}
          onPress={this.onSelectMenu}
          leftTitleStyle={styles.listViewTitle(theme)}
          leftIconStyle={styles.listViewIcon}
          itemContainer={styles.itemContainer}
          rightArrowIcon
          hasAvatar
        />
      </DefaultLayout>
    );
  }
}
