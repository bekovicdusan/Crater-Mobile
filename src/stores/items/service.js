import {pick} from 'lodash';
import * as queryString from 'query-string';
import Request from '@/utils/request';

/**
 * Fetch items
 * @param q : queryString
 * @returns {*}
 */
export const fetchItems = q =>
  Request.get({path: `items?${queryString.stringify(q)}`});

/**
 * Add item
 * @param item : item data
 * @returns {*}
 */
export const addItem = item => {
  const body = pick(item, [
    'name',
    'description',
    'price',
    'unit_id',
    'taxes',
    'customFields'
  ]);
  return Request.post({path: `items`, body});
};

/**
 * Update item
 * @param item : item data
 * @returns {*}
 */
export const updateItem = item =>
  Request.put({path: `items/${item?.item_id}`, body: item});

/**
 * Remove item
 * @param id : item id
 * @returns {*}
 */
export const removeItem = ({id}) =>
  Request.post({path: `items/delete`, body: {ids: [id]}});
