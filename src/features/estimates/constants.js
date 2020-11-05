import queryString from 'query-string';
import Lng from '@/lang/i18n';
import { colors } from '@/styles';

// Estimate Refs
// -----------------------------------------
export let estimateRefs = {};
export const setEstimateRefs = refs => (estimateRefs = refs);

//  Forms
// -----------------------------------------
export const ESTIMATE_SEARCH = 'estimateForm/ESTIMATE_SEARCH';
export const ESTIMATE_FORM = 'estimateForm/ESTIMATE_EDIT';
export const ITEM_FORM = 'item/ITEM_FORM';

// Type
// -----------------------------------------
export const ESTIMATE_ADD = 'estimateForm/ESTIMATE_ADD';
export const ESTIMATE_EDIT = 'estimateForm/ESTIMATE_EDIT';

// Actions
// -----------------------------------------
export const ESTIMATES_TRIGGER_SPINNER = 'estimate/ESTIMATES_TRIGGER_SPINNER';
export const GET_ESTIMATES = 'estimate/GET_ESTIMATES';
export const SET_ESTIMATES = 'estimate/SET_ESTIMATES';

export const CLEAR_ESTIMATES = 'estimate/CLEAR_ESTIMATES';
export const CLEAR_ESTIMATE = 'estimate/CLEAR_ESTIMATE';
export const GET_CREATE_ESTIMATE = 'estimate/GET_CREATE_ESTIMATE';
export const GET_EDIT_ESTIMATE = 'estimate/GET_EDIT_ESTIMATE';
export const SET_ESTIMATE = 'estimate/SET_ESTIMATE';
export const SET_EDIT_ESTIMATE = 'estimate/SET_EDIT_ESTIMATE';
export const CREATE_ESTIMATE = 'estimate/CREATE_ESTIMATE';
export const EDIT_ESTIMATE = 'estimate/EDIT_ESTIMATE';
export const CONVERT_TO_INVOICE = 'estimate/CONVERT_TO_INVOICE';
export const REMOVE_ESTIMATE = 'estimate/REMOVE_ESTIMATE';
export const REMOVE_FROM_ESTIMATES = 'estimate/REMOVE_FROM_ESTIMATES';
export const CHANGE_ESTIMATE_STATUS = 'estimate/CHANGE_ESTIMATE_STATUS';
export const GET_ESTIMATE_TEMPLATE = 'estimate/GET_ESTIMATE_TEMPLATE';
// Items
// -----------------------------------------
export const SET_EDIT_ESTIMATE_ITEMS = 'estimate/SET_EDIT_ESTIMATE_ITEMS';
export const REMOVE_ESTIMATE_ITEM = 'estimate/REMOVE_ESTIMATE_ITEM';
export const REMOVE_ESTIMATE_ITEMS = 'estimate/REMOVE_ESTIMATE_ITEMS';
export const ADD_ITEM = 'estimate/ADD_ITEM';
export const EDIT_ITEM = 'estimate/EDIT_ITEM';
export const GET_ITEMS = 'estimate/GET_ITEMS';
export const SET_ITEMS = 'estimate/SET_ITEMS';
export const SET_ESTIMATE_ITEMS = 'estimate/SET_ESTIMATE_ITEMS';
export const REMOVE_ITEM = 'estimate/REMOVE_ITEM';
export const ITEM_ADD = 'estimate/ITEM_ADD';
export const ITEM_EDIT = 'estimate/ITEM_EDIT';

export const ITEM_DISCOUNT_OPTION = [
    {
        key: 'none',
        label: 'None'
    },
    {
        key: 'fixed',
        label: 'Fixed'
    },
    {
        key: 'percentage',
        label: 'Percentage'
    }
];

export const ESTIMATE_DISCOUNT_OPTION = [
    {
        value: 'percentage',
        displayLabel: '%',
        label: 'Percentage'
    }
];

export const ESTIMATES_STATUS_BG_COLOR = {
    DRAFT: colors.warningLight,
    SENT: colors.warningLight2,
    VIEWED: colors.infoLight,
    EXPIRED: colors.dangerLight,
    REJECTED: colors.gray2,
    ACCEPTED: colors.successLight2
};

export const ESTIMATES_STATUS_TEXT_COLOR = {
    DRAFT: colors.warningDark,
    SENT: colors.warningDark2,
    VIEWED: colors.infoDark,
    EXPIRED: colors.dangerDark,
    REJECTED: colors.darkGray2,
    ACCEPTED: colors.successDark
};

export const TAB_NAME = (name, locale) => {
    return Lng.t(`estimates.tabs.${name}`, { locale });
};

export const ESTIMATES_TABS = {
    SENT: 'SENT',
    DRAFT: 'DRAFT',
    ALL: 'ALL'
};

// Filter Estimate Mode
// -----------------------------------------
export const FILTER_ESTIMATE_STATUS = [
    { label: 'DRAFT', value: 'DRAFT' },
    { label: 'SENT', value: 'SENT' },
    { label: 'VIEWED', value: 'VIEWED' },
    { label: 'EXPIRED', value: 'EXPIRED' },
    { label: 'ACCEPTED', value: 'ACCEPTED' },
    { label: 'REJECTED', value: 'REJECTED' }
];

export const ESTIMATES_STATUS = {
    SENT: 'danger',
    DRAFT: 'warning',
    PAID: 'success'
};

export const ESTIMATE_ACTIONS = {
    VIEW: 'download',
    SEND: 'send',
    DELETE: 'delete',
    EDIT: 'edit',
    CONVERT_TO_INVOICE: 'convertToInvoice',
    MARK_AS_SENT: 'markAsSent',
    MARK_AS_ACCEPTED: 'markAsAccepted',
    MARK_AS_REJECTED: 'markAsRejected'
};

export const MARK_AS_SENT = 'SENT';
export const MARK_AS_ACCEPT = 'ACCEPTED';
export const MARK_AS_REJECT = 'REJECTED';

export const EDIT_ESTIMATE_ACTIONS = (locale, markAs = '') => {
    const markAsSent = [
        {
            label: Lng.t('estimates.actions.markAsSent', { locale }),
            value: ESTIMATE_ACTIONS.MARK_AS_SENT
        }
    ];

    const markAsAccept = [
        {
            label: Lng.t('estimates.actions.markAsAccepted', { locale }),
            value: ESTIMATE_ACTIONS.MARK_AS_ACCEPTED
        }
    ];

    const markAsReject = [
        {
            label: Lng.t('estimates.actions.markAsRejected', { locale }),
            value: ESTIMATE_ACTIONS.MARK_AS_REJECTED
        }
    ];

    const deleteAction = [
        {
            label: Lng.t('estimates.actions.delete', { locale }),
            value: ESTIMATE_ACTIONS.DELETE
        }
    ];

    const actions = [
        {
            label: Lng.t('estimates.actions.convertToInvoice', { locale }),
            value: ESTIMATE_ACTIONS.CONVERT_TO_INVOICE
        },
        {
            label: Lng.t(
                markAs === MARK_AS_SENT
                    ? 'estimates.actions.reSendEstimate'
                    : 'estimates.actions.sendEstimate',
                { locale }
            ),
            value: ESTIMATE_ACTIONS.SEND
        }
    ];

    let items = [];

    if (markAs === MARK_AS_SENT) {
        items = [...markAsAccept, ...markAsReject];
    } else if (markAs === MARK_AS_ACCEPT) {
        items = [...markAsSent, ...markAsReject];
    } else if (markAs === MARK_AS_REJECT) {
        items = [...markAsSent, ...markAsAccept];
    } else {
        items = [...markAsSent, ...markAsAccept, ...markAsReject];
    }

    return [...actions, ...items, ...deleteAction];
};
