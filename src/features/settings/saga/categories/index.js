import { call, put, takeEvery } from 'redux-saga/effects';
import * as queryStrings from 'query-string';
import {
    settingsTriggerSpinner,
    setExpenseCategories,
    setCreateExpenseCategories,
    setEditExpenseCategories,
    setRemoveExpenseCategories
} from '../../actions';
import {
    GET_EXPENSE_CATEGORIES,
    CREATE_EXPENSE_CATEGORY,
    GET_CREATE_EXPENSE_CATEGORY,
    EDIT_EXPENSE_CATEGORY,
    REMOVE_EXPENSE_CATEGORY
} from '../../constants';
import { ROUTES } from '@/navigation';
import Request from '@/api/request';

function* getExpenseCategories({ payload }) {
    const { fresh = true, onSuccess, queryString } = payload;

    try {
        const options = {
            path: `categories?${queryStrings.stringify(queryString)}`
        };

        const response = yield call([Request, 'get'], options);

        if (response?.categories) {
            const { data } = response.categories;
            yield put(setExpenseCategories({ categories: data, fresh }));
        }

        onSuccess?.(response?.categories);
    } catch (error) {
    } finally {
    }
}

function* createExpenseCategory({ payload: { params, onResult } }) {
    yield put(settingsTriggerSpinner({ expenseCategoryLoading: true }));

    try {
        const options = {
            path: `categories`,
            body: params
        };

        const response = yield call([Request, 'post'], options);

        yield put(
            setCreateExpenseCategories({ categories: [response.category] })
        );

        onResult?.(response?.category);
    } catch (e) {
    } finally {
        yield put(settingsTriggerSpinner({ expenseCategoryLoading: false }));
    }
}

function* getEditExpenseCategory({ payload: { id, onResult } }) {
    yield put(settingsTriggerSpinner({ initExpenseCategoryLoading: true }));

    try {
        const options = {
            path: `categories/${id}/edit`
        };

        const response = yield call([Request, 'get'], options);
        onResult?.(response.category);
    } catch (e) {
    } finally {
        yield put(
            settingsTriggerSpinner({ initExpenseCategoryLoading: false })
        );
    }
}

function* editExpenseCategory({ payload: { id, params, navigation } }) {
    yield put(settingsTriggerSpinner({ expenseCategoryLoading: true }));

    try {
        const options = {
            path: `categories/${id}`,
            body: params
        };

        const response = yield call([Request, 'put'], options);
        navigation.navigate(ROUTES.CATEGORIES);
        yield put(
            setEditExpenseCategories({ categories: [response.category], id })
        );
    } catch (e) {
    } finally {
        yield put(settingsTriggerSpinner({ expenseCategoryLoading: false }));
    }
}

function* removeExpenseCategory({ payload: { id, navigation, onResult } }) {
    yield put(settingsTriggerSpinner({ expenseCategoryLoading: true }));

    try {
        const options = {
            path: `categories/${id}`
        };

        const response = yield call([Request, 'delete'], options);

        if (response.success) {
            navigation.navigate(ROUTES.CATEGORIES);
            yield put(setRemoveExpenseCategories({ id }));
        } else {
            onResult?.();
        }
    } catch (error) {
    } finally {
        yield put(settingsTriggerSpinner({ expenseCategoryLoading: false }));
    }
}

export default function* categoriesSaga() {
    // Expense Categories
    // -----------------------------------------
    yield takeEvery(GET_EXPENSE_CATEGORIES, getExpenseCategories);
    yield takeEvery(CREATE_EXPENSE_CATEGORY, createExpenseCategory);
    yield takeEvery(GET_CREATE_EXPENSE_CATEGORY, getEditExpenseCategory);
    yield takeEvery(EDIT_EXPENSE_CATEGORY, editExpenseCategory);
    yield takeEvery(REMOVE_EXPENSE_CATEGORY, removeExpenseCategory);
}
