import React, { Component } from 'react';

import {
    View,
    Modal,
} from 'react-native';
import styles from './styles';
import { ListView } from '../ListView';
import { MainLayout, DefaultLayout } from '../Layouts';

type IProps = {
    visible: Boolean,
    onToggle: Function,
    headerProps: Object,
    onSearch: Function,
    bottomDivider: Boolean,
    hasSearchField: Boolean,
    listViewProps: Object,
    defaultLayout: Boolean,
    children: Object,
    bottomAction: Object,
    searchInputProps: Object,
};

export class SlideModal extends Component<IProps> {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {

        const {
            visible,
            onToggle,
            headerProps,
            onSearch,
            bottomDivider = false,
            listViewProps,
            hasListView,
            imageListView,
            defaultLayout,
            children,
            hasSearchField,
            bottomAction,
            searchInputProps
        } = this.props

        return (
            <Modal
                animationType="slide"
                visible={visible}
                onRequestClose={onToggle && onToggle}
                hardwareAccelerated={true}
            >
                <View style={styles.modalContainer}>
                    {!defaultLayout && (
                        <MainLayout
                            headerProps={headerProps && headerProps}
                            onSearch={onSearch}
                            bottomDivider={bottomDivider}
                            bottomAction={bottomAction}
                            inputProps={searchInputProps && searchInputProps}
                        >
                            <View style={styles.listViewContainer}>
                                <ListView
                                    {...listViewProps}
                                />
                            </View>
                        </MainLayout>
                    )}

                    {defaultLayout && (
                        <DefaultLayout
                            headerProps={headerProps && headerProps}
                            bottomAction={bottomAction}
                        >
                            {children ? (
                                <View style={styles.bodyContainer}>
                                    {children}
                                </View>
                            ) : (
                                    <View style={styles.listViewContainer}>
                                        <ListView
                                            {...listViewProps}
                                        />
                                    </View>
                                )}

                        </DefaultLayout>
                    )}
                </View>
            </Modal>
        );
    }
}

