import { call, put, takeEvery } from 'redux-saga/effects';
import { I18nManager } from 'react-native';
import { Updates } from 'expo';
import Request from '@/api/request';
import {
    settingsTriggerSpinner as spinner,
    setPreferences,
    setSettings
} from '../../actions';
import {
    GET_PREFERENCES,
    EDIT_PREFERENCES,
    PREFERENCES_SETTING_TYPE
} from '../../constants';
import { setI18nManagerValue } from '@/utils';
import { isArray } from '@/constants';
import { getGeneralSetting } from '../general';

function* getPreferences({ payload: { onResult } }) {
    yield put(spinner({ getPreferencesLoading: true }));

    try {
        const options = {
            path: `company/settings`,
            axiosProps: {
                params: { settings: PREFERENCES_SETTING_TYPE }
            }
        };

        const response = yield call([Request, 'get'], options);

        const currencies = yield call(getGeneralSetting, {
            payload: { url: 'currencies', returnResponse: true }
        });

        let selectedCurrency = null;

        if (isArray(currencies)) {
            selectedCurrency = currencies.find(
                currency => currency?.id === Number(response?.currency)
            );
        }

        yield put(setPreferences({ preferences: response }));
        yield put(setSettings({ settings: { ...response, selectedCurrency } }));
        onResult?.({ ...response, currencies });
    } catch (e) {
    } finally {
        yield put(spinner({ getPreferencesLoading: false }));
    }
}

function* editPreferences({ payload }) {
    const { params, navigation, locale = 'en', currencies = null } = payload;

    yield put(spinner({ editPreferencesLoading: true }));

    try {
        const options = {
            path: `company/settings`,
            body: { settings: params }
        };

        const response = yield call([Request, 'post'], options);

        if (response?.success) {
            let selectedCurrency = null;
            if (params?.currency && isArray(currencies)) {
                selectedCurrency = currencies.find(
                    currency =>
                        currency?.fullItem?.id === Number(params?.currency)
                );
                selectedCurrency = selectedCurrency?.fullItem;
            }
            yield put(
                setSettings({ settings: { ...params, selectedCurrency } })
            );
        }

        if (params?.language) {
            const options = {
                path: `me/settings`,
                body: { settings: { language: params?.language } }
            };
            const res = yield call([Request, 'put'], options);

            if (res.success) {
                const isRTL = params.language === 'ar';
                setI18nManagerValue({ isRTL });
                if (locale === 'ar' || isRTL) {
                    Updates.reload();
                }
            }
        }

        navigation.goBack(null);
    } catch (e) {
    } finally {
        yield put(spinner({ editPreferencesLoading: false }));
    }
}

export default function* preferencesSaga() {
    yield takeEvery(GET_PREFERENCES, getPreferences);
    yield takeEvery(EDIT_PREFERENCES, editPreferences);
}
