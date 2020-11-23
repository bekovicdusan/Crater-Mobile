// @flow

import React from 'react';
import { ActivityIndicator } from 'react-native';
import { colors } from '@/styles';

type IProps = {
    size: 'small' | 'large',
    color: string,
    style: Object,
};

export const Loading = ({ size = 'large', color = colors.veryDarkGray, style }: IProps) => (
    <ActivityIndicator size={size} style={{ flex: 1, ...style }} color={color} />
);
