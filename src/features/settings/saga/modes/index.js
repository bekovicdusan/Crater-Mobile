import { call, put, takeEvery } from 'redux-saga/effects';
import * as queryStrings from 'query-string';
import {
    settingsTriggerSpinner,
    setPaymentModes,
    setPaymentMode
} from '../../actions';
import {
    GET_PAYMENT_MODES,
    CREATE_PAYMENT_MODE,
    EDIT_PAYMENT_MODE,
    REMOVE_PAYMENT_MODE
} from '../../constants';

import { getTitleByLanguage } from '@/utils';
import Request from '@/api/request';
import { alertMe } from '@/constants';

export function* getPaymentModes({ payload }) {
    const { fresh = true, onSuccess, queryString } = payload;

    try {
        const options = {
            path: `payment-methods?${queryStrings.stringify(queryString)}`
        };

        const response = yield call([Request, 'get'], options);

        if (response?.paymentMethods) {
            const { data } = response.paymentMethods;
            yield put(setPaymentModes({ paymentMethods: data, fresh }));
        }

        onSuccess?.(response?.paymentMethods);
    } catch (e) {}
}

function* createPaymentMode({ payload: { params } }) {
    yield put(settingsTriggerSpinner({ paymentModeLoading: true }));

    try {
        const options = {
            path: `payment-methods`,
            body: params
        };

        const response = yield call([Request, 'post'], options);

        yield put(
            setPaymentMode({
                paymentMethod: [response.paymentMethod],
                isCreated: true
            })
        );
    } catch (e) {
    } finally {
        yield put(settingsTriggerSpinner({ paymentModeLoading: false }));
    }
}

function* editPaymentMode({ payload: { id, params } }) {
    yield put(settingsTriggerSpinner({ paymentModeLoading: true }));

    try {
        const options = {
            path: `payment-methods/${id}`,
            body: params
        };

        const response = yield call([Request, 'put'], options);

        yield put(
            setPaymentMode({
                paymentMethod: [response.paymentMethod],
                isUpdated: true
            })
        );
    } catch (e) {
    } finally {
        yield put(settingsTriggerSpinner({ paymentModeLoading: false }));
    }
}

function* removePaymentMode({ payload: { id } }) {
    yield put(settingsTriggerSpinner({ paymentModeLoading: true }));

    try {
        const options = {
            path: `payment-methods/${id}`
        };

        const response = yield call([Request, 'delete'], options);

        if (response.success) yield put(setPaymentMode({ id, isRemove: true }));

        if (response.error && response.error === 'payments_attached')
            setTimeout(() => {
                alertMe({
                    title: getTitleByLanguage('payments.alreadyInUseMode')
                });
            }, 1000);
    } catch (e) {
    } finally {
        yield put(settingsTriggerSpinner({ paymentModeLoading: false }));
    }
}

export default function* paymentMethodsSaga() {
    // Payment Method
    // -----------------------------------------
    yield takeEvery(GET_PAYMENT_MODES, getPaymentModes);
    yield takeEvery(CREATE_PAYMENT_MODE, createPaymentMode);
    yield takeEvery(EDIT_PAYMENT_MODE, editPaymentMode);
    yield takeEvery(REMOVE_PAYMENT_MODE, removePaymentMode);
}
