import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';
import * as ExpensesAction from '../../actions';
import * as CategoriesAction from '../../../settings/actions';
import { colors } from '@/styles';
import { Expenses } from '../../components/Expenses';
import { EXPENSE_SEARCH } from '../../constants';
import { EXPENSES_ICON } from '@/assets';
import { getTitleByLanguage } from '@/utils';
import { withNavigationFocus } from 'react-navigation';
import {
    getExpensesState,
    getFilterExpensesState,
    getCategoriesState
} from '../../selectors';
import { AssetSvg } from '@/components';

const mapStateToProps = state => {
    const {
        global: { locale, currency },
        expenses: {
            expenses,
            filterExpenses,
            loading: { expensesLoading }
        },
        settings: { categories }
    } = state;

    return {
        loading: expensesLoading,
        expenses: getExpensesState(expenses, currency),
        filterExpenses: getFilterExpensesState(filterExpenses, currency),
        locale,
        currency,
        categories: getCategoriesState(categories),
        formValues: getFormValues(EXPENSE_SEARCH)(state) || {}
    };
};

const mapDispatchToProps = {
    getExpenses: ExpensesAction.getExpenses,
    getCategories: CategoriesAction.getExpenseCategories
};
//  Redux Forms
const ExpensesSearchReduxForm = reduxForm({
    form: EXPENSE_SEARCH
})(Expenses);

//  connect
const ExpensesContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ExpensesSearchReduxForm);

ExpensesContainer.navigationOptions = ({ navigation }) => ({
    gesturesEnabled: false,
    tabBarLabel: getTitleByLanguage('tabNavigation.expenses'),
    tabBarIcon: ({ focused }: { focused: boolean }) => (
        <AssetSvg 
            name={EXPENSES_ICON}
            fill={focused ? colors.primary : colors.darkGray}
        />
    )
});

export default withNavigationFocus(ExpensesContainer);
