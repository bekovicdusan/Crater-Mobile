import queryString from 'query-string';
import { ROUTES } from '@/navigation';

// Forms
// -----------------------------------------
export const SET_ENDPOINT_API = 'moreForm/SET_ENDPOINT_API';

export const ITEM_FORM = 'moreForm/ITEM_FORM';
export const ITEM_SEARCH = 'moreForm/ITEM_SEARCH';

export const REPORTS_SEARCH = 'moreForm/REPORTS_SEARCH';
export const REPORT_FORM = 'moreForm/REPORT_FORM';

// Actions
// -----------------------------------------
export const MORE_SEARCH = 'more/MORE_SEARCH';
export const MORE_TRIGGER_SPINNER = 'more/MORE_TRIGGER_SPINNER';
export const LOGOUT = 'more/LOGOUT';
export const ITEM_EDIT = 'more/ITEM_EDIT';
export const ITEM_ADD = 'more/ITEM_ADD';
export const CLEAR_ITEM = 'more/CLEAR_ITEM';
export const DELETE_ITEM = 'more/DELETE_ITEM';
export const REMOVE_ITEM = 'more/REMOVE_ITEM';
export const GET_ITEMS = 'more/GET_ITEMS';
export const GET_EDIT_ITEM = 'more/GET_EDIT_ITEM';
export const SET_ITEMS = 'more/SET_ITEMS';
export const SET_ITEM = 'more/SET_ITEM';
export const GET_MAIL_CONFIGURATION = 'GET_MAIL_CONFIGURATION';
// Report
// -----------------------------------------
export const GENERATE_REPORT = 'report/GENERATE_REPORT';

export const ADD_ITEM = 'itemType/ADD_ITEM';
export const EDIT_ITEM = 'itemType/EDIT_ITEM';
export const SALES = 'reportType/SALES';
export const PROFIT_AND_LOSS = 'reportType/PROFIT_AND_LOSS';
export const EXPENSES = 'reportType/EXPENSES';
export const TAXES = 'reportType/TAXES';

// Menus
// -----------------------------------------
export const MORE_MENU = (locale, Lng) => {
    return [
        {
            title: Lng.t('more.estimate', { locale }),
            leftIcon: 'file-alt',
            leftIconSolid: true,
            iconSize: 27,
            fullItem: {
                route: ROUTES.ESTIMATE_LIST
            }
        },
        // {
        //     title: Lng.t('more.recurringInvoice', { locale }),
        //     leftIcon: 'file-alt',
        //     iconSize: 27,
        //     fullItem: {
        //         route: ROUTES.RECURRING_INVOICES
        //     }
        // },
        {
            title: Lng.t('more.items', { locale }),
            leftIcon: 'product-hunt',
            iconSize: 27,
            fullItem: {
                route: ROUTES.GLOBAL_ITEMS
            }
        },
        {
            title: Lng.t('more.reports', { locale }),
            leftIcon: 'signal',
            fullItem: {
                route: ROUTES.REPORTS
            }
        },
        {
            title: Lng.t('more.settings', { locale }),
            leftIcon: 'cogs',
            fullItem: {
                route: ROUTES.SETTING_LIST
            }
        },
        {
            title: Lng.t('more.logout', { locale }),
            leftIcon: 'sign-out-alt',
            iconSize: 26,
            fullItem: {
                action: 'onLogout'
            }
        }
    ];
};

export const REPORTS_MENU = (locale, Lng) => {
    return [
        {
            title: Lng.t('reports.sales', { locale }),
            fullItem: {
                route: ROUTES.GENERATE_REPORT,
                type: SALES
            }
        },
        {
            title: Lng.t('reports.profitAndLoss', { locale }),
            leftIcon: 'building',
            fullItem: {
                route: ROUTES.GENERATE_REPORT,
                type: PROFIT_AND_LOSS
            }
        },
        {
            title: Lng.t('reports.expenses', { locale }),
            fullItem: {
                route: ROUTES.GENERATE_REPORT,
                type: EXPENSES
            }
        },
        {
            title: Lng.t('reports.taxes', { locale }),
            fullItem: {
                route: ROUTES.GENERATE_REPORT,
                type: TAXES
            }
        }
    ];
};

export const REPORT_TYPE_OPTION = (locale, Lng) => {
    return [
        {
            label: Lng.t('reports.byCustomer', { locale }),
            value: 'byCustomer'
        },
        {
            label: Lng.t('reports.byItem', { locale }),
            value: 'byItem'
        }
    ];
};

export const DATE_RANGE = {
    TODAY: 'today',
    THIS_WEEK: 'thisWeek',
    THIS_MONTH: 'thisMonth',
    THIS_QUARTER: 'thisQuarter',
    THIS_YEAR: 'thisYear',
    CURRENT_FISCAL_QUARTER: 'currentFiscalQuarter',
    CURRENT_FISCAL_YEAR: 'currentFiscalYear',
    PREVIOUS_WEEK: 'previousWeek',
    PREVIOUS_MONTH: 'previousMonth',
    PREVIOUS_QUARTER: 'previousQuarter',
    PREVIOUS_YEAR: 'previousYear',
    PREVIOUS_FISCAL_QUARTER: 'previousFiscalQuarter',
    PREVIOUS_FISCAL_YEAR: 'previousFiscalYear',
    CUSTOM: 'custom'
};

export const DATE_RANGE_OPTION = (locale, Lng) => {
    return [
        {
            label: Lng.t('reports.today', { locale }),
            value: DATE_RANGE.TODAY
        },
        {
            label: Lng.t('reports.thisWeek', { locale }),
            value: DATE_RANGE.THIS_WEEK
        },
        {
            label: Lng.t('reports.thisMonth', { locale }),
            value: DATE_RANGE.THIS_MONTH
        },
        {
            label: Lng.t('reports.thisQuarter', { locale }),
            value: DATE_RANGE.THIS_QUARTER
        },
        {
            label: Lng.t('reports.thisYear', { locale }),
            value: DATE_RANGE.THIS_YEAR
        },
        // {
        //     label: Lng.t("reports.currentFiscalQuarter", { locale }),
        //     value: DATE_RANGE.CURRENT_FISCAL_QUARTER
        // },
        {
            label: Lng.t('reports.currentFiscalYear', { locale }),
            value: DATE_RANGE.CURRENT_FISCAL_YEAR
        },
        {
            label: Lng.t('reports.previousWeek', { locale }),
            value: DATE_RANGE.PREVIOUS_WEEK
        },
        {
            label: Lng.t('reports.previousMonth', { locale }),
            value: DATE_RANGE.PREVIOUS_MONTH
        },
        {
            label: Lng.t('reports.previousQuarter', { locale }),
            value: DATE_RANGE.PREVIOUS_QUARTER
        },
        {
            label: Lng.t('reports.previousYear', { locale }),
            value: DATE_RANGE.PREVIOUS_YEAR
        },
        // {
        //     label: Lng.t("reports.previousFiscalQuarter", { locale }),
        //     value: DATE_RANGE.PREVIOUS_FISCAL_QUARTER
        // },
        {
            label: Lng.t('reports.previousFiscalYear', { locale }),
            value: DATE_RANGE.PREVIOUS_FISCAL_YEAR
        },
        {
            label: Lng.t('reports.custom', { locale }),
            value: DATE_RANGE.CUSTOM
        }
    ];
};
