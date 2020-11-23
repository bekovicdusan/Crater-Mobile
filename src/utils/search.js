import { hasValue, isArray } from '@/constants';

export const internalSearch = ({ items, search, searchFields }) => {
    if (!isArray(items)) {
        return [];
    }
    return items.filter(item => {
        let filterData = false;

        searchFields.filter(field => {
            let itemField = item.fullItem[field];

            if (typeof itemField === 'number') {
                itemField = itemField.toString();
            }

            if (hasValue(itemField)) {
                itemField = itemField.toLowerCase();
                const searchData = search.toString().toLowerCase();

                if (itemField.indexOf(searchData) > -1) {
                    filterData = true;
                }
            }
        });
        return filterData;
    });
};
