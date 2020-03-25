
import { ROUTES } from "../routes";
import SettingsContainer from "../../features/settings/containers/Settings";
import AccountContainer from "../../features/settings/containers/Account";
import CompanyContainer from "../../features/settings/containers/Company";
import LanguageAndCurrencyContainer from "../../features/settings/containers/LanguageAndCurrency";
import { generateStackNavigation } from "../actions";
import NotificationContainer from "../../features/settings/containers/Notification";
import PreferencesContainer from "../../features/settings/containers/Preferences";
import CategoriesContainer from "../../features/settings/containers/Categories";
import CategoryContainer from "../../features/settings/containers/Category";
import TaxesContainer from "../../features/settings/containers/Taxes";
import TaxContainer from "../../features/settings/containers/Tax";
import EndpointContainer from "../../features/authentication/containers/Endpoint";
import UpdateAppVersionContainer from "../../components/UpdateAppVersion";
import CustomizesContainer from "../../features/settings/containers/Customizes";
import CustomizeContainer from "../../features/settings/containers/Customize";
import CurrenciesContainer from "../../features/settings/containers/Currencies";
import CurrencyContainer from "../../features/settings/containers/Currency";
import CustomFieldsContainer from "../../features/settings/containers/CustomFields";
import CustomFieldContainer from "../../features/settings/containers/CustomField";

export const SettingNavigator = {

    // Settings
    // -----------------------------------------
    [ROUTES.SETTING_LIST]: generateStackNavigation(
        ROUTES.SETTING_LIST,
        SettingsContainer,
    ),
    [ROUTES.LANGUAGE_AND_CURRENCY]: generateStackNavigation(
        ROUTES.LANGUAGE_AND_CURRENCY,
        LanguageAndCurrencyContainer,
    ),
    [ROUTES.NOTIFICATIONS]: generateStackNavigation(
        ROUTES.NOTIFICATIONS,
        NotificationContainer,
    ),
    [ROUTES.PREFERENCES]: generateStackNavigation(
        ROUTES.PREFERENCES,
        PreferencesContainer,
    ),

    // User Information
    // -----------------------------------------
    [ROUTES.ACCOUNT_INFO]: generateStackNavigation(
        ROUTES.ACCOUNT_INFO,
        AccountContainer,
    ),
    [ROUTES.COMPANY_INFO]: generateStackNavigation(
        ROUTES.COMPANY_INFO,
        CompanyContainer,
    ),

    // Taxes
    // -----------------------------------------
    [ROUTES.TAXES]: generateStackNavigation(
        ROUTES.TAXES,
        TaxesContainer,
    ),
    [ROUTES.TAX]: generateStackNavigation(
        ROUTES.TAX,
        TaxContainer,
    ),

    // Categories
    // -----------------------------------------
    [ROUTES.CATEGORIES]: generateStackNavigation(
        ROUTES.CATEGORIES,
        CategoriesContainer,
    ),
    [ROUTES.CATEGORY]: generateStackNavigation(
        ROUTES.CATEGORY,
        CategoryContainer,
    ),
    [ROUTES.ENDPOINTS_SETTINGS]: generateStackNavigation(
        ROUTES.ENDPOINTS_SETTINGS,
        EndpointContainer
    ),

    // Customize
    // -----------------------------------------
    [ROUTES.CUSTOMIZES]: generateStackNavigation(
        ROUTES.CUSTOMIZES,
        CustomizesContainer
    ),
    [ROUTES.CUSTOMIZE]: generateStackNavigation(
        ROUTES.CUSTOMIZE,
        CustomizeContainer
    ),

    // Currencies
    // -----------------------------------------
    [ROUTES.CURRENCIES]: generateStackNavigation(
        ROUTES.CURRENCIES,
        CurrenciesContainer
    ),
    [ROUTES.CURRENCY]: generateStackNavigation(
        ROUTES.CURRENCY,
        CurrencyContainer
    ),

    // Custom Fields
    // -----------------------------------------
    [ROUTES.CUSTOM_FIELDS]: generateStackNavigation(
        ROUTES.CUSTOM_FIELDS,
        CustomFieldsContainer
    ),
    [ROUTES.CUSTOMER_FIELD]: generateStackNavigation(
        ROUTES.CUSTOMER_FIELD,
        CustomFieldContainer
    ),

    // Update App Version
    // -----------------------------------------
    [ROUTES.UPDATE_APP_VERSION]: generateStackNavigation(
        ROUTES.UPDATE_APP_VERSION,
        UpdateAppVersionContainer,
    ),

}
