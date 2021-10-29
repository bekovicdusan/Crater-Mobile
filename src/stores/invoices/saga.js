import {call, put, takeLatest, takeEvery} from 'redux-saga/effects';
import {routes} from '@/navigation';
import {getCustomFields} from '@/features/settings/saga/custom-fields';
import {CUSTOM_FIELD_TYPES} from '@/features/settings/constants';
import t from 'locales/use-translation';
import {showNotification, handleError} from '@/utils';
import {fetchTaxAndDiscountPerItem} from 'stores/common/actions';
import * as types from './types';
import * as req from './service';
import {getNextNumber, getSettingInfo} from '@/features/settings/saga/general';
import {spinner} from './actions';

/**
 * Fetch invoice templates saga
 * @returns {IterableIterator<*>}
 */
function* fetchInvoiceData() {
  try {
    const {invoiceTemplates} = yield call(req.fetchInvoiceTemplates);
    const {invoice_auto_generate} = yield call(getSettingInfo, {
      payload: {keys: ['invoice_auto_generate']}
    });
    const nextInvoiceNumber = yield call(getNextNumber, {
      payload: {key: 'invoice'}
    });
    yield put({
      type: types.FETCH_INVOICE_DATA_SUCCESS,
      payload: {...nextInvoiceNumber, invoice_auto_generate, invoiceTemplates}
    });
  } catch (e) {}
}

/**
 * Fetch recurring invoice initial details saga
 * @returns {IterableIterator<*>}
 */
function* fetchInvoiceInitialDetails({payload}) {
  yield put({type: types.CLEAR_INVOICE});
  yield call(fetchInvoiceData);
  yield put(fetchTaxAndDiscountPerItem());
  payload?.();
}

/**
 * Fetch invoices saga
 * @returns {IterableIterator<*>}
 */
function* fetchInvoices({payload}) {
  const {fresh = true, onSuccess, onFail, queryString} = payload;
  try {
    const response = yield call(req.fetchInvoices, queryString);
    const invoices = response?.data ?? [];
    yield put({type: types.FETCH_INVOICES_SUCCESS, payload: {invoices, fresh}});
    onSuccess?.(response);
  } catch (e) {
    onFail?.();
  }
}

/**
 * Fetch single invoice saga
 * @returns {IterableIterator<*>}
 */
function* fetchSingleInvoice({payload}) {
  try {
    const {id, onSuccess} = payload;
    yield call(getCustomFields, {
      payload: {queryString: {type: CUSTOM_FIELD_TYPES.INVOICE, limit: 'all'}}
    });
    const response = yield call(req.fetchSingleInvoice, id);

    yield put({type: types.CLEAR_INVOICE});
    yield call(fetchInvoiceData);
    yield put({
      type: types.ADD_INVOICE_ITEM_SUCCESS,
      payload: response?.data?.invoiceItems ?? []
    });
    onSuccess?.(response);
  } catch (e) {}
}

/**
 * Add invoice saga
 * @returns {IterableIterator<*>}
 */
function* addInvoice({payload}) {
  try {
    yield put(spinner('isSaving', true));
    const {invoice, onSuccess} = payload;
    const {data} = yield call(req.addInvoice, invoice);
    yield put({type: types.ADD_INVOICE_SUCCESS, payload: data});
    onSuccess?.(data);
    showNotification({message: t('notification.invoice_created')});
  } catch (e) {
    handleError(e);
  } finally {
    yield put(spinner('isSaving', false));
  }
}

/**
 * Update invoice saga
 * @returns {IterableIterator<*>}
 */
function* updateInvoice({payload}) {
  try {
    yield put(spinner('isSaving', true));
    const {invoice, onSuccess} = payload;
    const {data} = yield call(req.updateInvoice, invoice.id, invoice);
    yield put({type: types.UPDATE_INVOICE_SUCCESS, payload: data});
    onSuccess?.(data);
    showNotification({message: t('notification.invoice_updated')});
  } catch (e) {
    handleError(e);
  } finally {
    yield put(spinner('isSaving', false));
  }
}

/**
 * Remove invoice saga
 * @returns {IterableIterator<*>}
 */
function* removeInvoice({payload}) {
  try {
    yield put(spinner('isDeleting', true));
    const {id, navigation} = payload;
    yield call(req.removeInvoice, id);
    yield put({type: types.REMOVE_INVOICE_SUCCESS, payload: id});
    navigation.goBack(null);
    showNotification({message: t('notification.invoice_deleted')});
  } catch (e) {
    handleError(e);
  } finally {
    yield put(spinner('isDeleting', false));
  }
}

/**
 * Add invoice item saga
 * @returns {IterableIterator<*>}
 */
function* addInvoiceItem({payload}) {
  try {
    const {item, onResult} = payload;
    const {data} = yield call(req.addInvoiceItem, item);
    const items = [{...data, item_id: data.id, ...item}];
    yield put({type: types.ADD_INVOICE_ITEM_SUCCESS, payload: items ?? []});
    onResult?.();
  } catch (e) {}
}

/**
 * Remove invoice item saga
 * @returns {IterableIterator<*>}
 */
function* removeInvoiceItem({payload}) {
  try {
    yield put(spinner('isDeleting', false));
    const {id} = payload;
    yield put({type: types.REMOVE_INVOICE_ITEM_SUCCESS, payload: id});
  } catch (e) {
  } finally {
    yield put(spinner('isDeleting', false));
  }
}

/**
 * Change invoice status saga
 * @returns {IterableIterator<*>}
 */
function* changeInvoiceStatus({payload}) {
  try {
    yield put(spinner('isLoading', true));
    const {onResult = null, params, action, navigation} = payload;
    yield call(req.changeInvoiceStatus, action, params);
    onResult?.();
    navigation.navigate(routes.MAIN_INVOICES);
  } catch (e) {
  } finally {
    yield put(spinner('isLoading', false));
  }
}

export default function* invoicesSaga() {
  yield takeLatest(types.FETCH_INITIAL_DETAILS, fetchInvoiceInitialDetails);
  yield takeLatest(types.FETCH_INVOICES, fetchInvoices);
  yield takeLatest(types.FETCH_SINGLE_INVOICE, fetchSingleInvoice);
  yield takeLatest(types.ADD_INVOICE, addInvoice);
  yield takeLatest(types.UPDATE_INVOICE, updateInvoice);
  yield takeLatest(types.REMOVE_INVOICE, removeInvoice);
  yield takeLatest(types.ADD_INVOICE_ITEM, addInvoiceItem);
  yield takeLatest(types.REMOVE_INVOICE_ITEM, removeInvoiceItem);
  yield takeEvery(types.CHANGE_INVOICE_STATUS, changeInvoiceStatus);
}
