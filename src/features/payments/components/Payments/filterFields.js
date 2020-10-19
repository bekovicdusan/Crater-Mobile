import Lng from '@/lang/i18n';
import { IMAGES } from '@/assets';

export default paymentsFilterFields = ({ props, state, setFormField }) => {

    const {
        getCustomers,
        customers,
        locale,
        navigation,
        paymentMethods
    } = props
    const { selectedPaymentMode } = state

    let filterRefs = {}

    const selectFields = [
        {
            name: "customer_id",
            apiSearch: true,
            hasPagination: true,
            getItems: getCustomers,
            items: customers,
            displayName: "name",
            label: Lng.t("payments.customer", { locale }),
            icon: 'user',
            placeholder: Lng.t("customers.placeholder", { locale }),
            navigation: navigation,
            compareField: "id",
            onSelect: (item) => setFormField('customer_id', item.id),
            headerProps: {
                title: Lng.t("customers.title", { locale }),
                rightIconPress: null
            },
            listViewProps: { hasAvatar: true },
            emptyContentProps: {
                contentType: "customers",
                image: IMAGES.EMPTY_CUSTOMERS,
            }
        }
    ]

    const inputFields = [{
        name: 'payment_number',
        hint: Lng.t("payments.number", { locale }),
        leftIcon: 'hashtag',
        inputProps: {
            autoCapitalize: 'none',
            autoCorrect: true,
        },
        refLinkFn: (ref) => filterRefs.paymentNumber = ref
    }]

    const dropdownFields = [{
        name: "payment_method_id",
        label: Lng.t("payments.mode", { locale }),
        fieldIcon: 'align-center',
        items: paymentMethods,
        onChangeCallback: (val) => setFormField('payment_method_id', val),
        defaultPickerOptions: {
            label: Lng.t("payments.modePlaceholder", { locale }),
            value: '',
        },
        selectedItem: selectedPaymentMode,
        onDonePress: () => filterRefs.paymentNumber.focus(),
        containerStyle: {
            marginTop: 12,
            marginBottom: 5
        }
    }]

    return {
        selectFields,
        inputFields,
        dropdownFields
    }
}

