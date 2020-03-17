import React, { Component } from 'react'
import { invoiceRefs } from '../constants'

function invoiceSubTotal() {
    const { invoiceItems = [] } = invoiceRefs?.props
    let subTotal = 0

    invoiceItems.map(val => (subTotal += JSON.parse(val.total)))

    return JSON.parse(subTotal)
}

function invoiceTax() {
    const { formValues: { taxes } } = invoiceRefs?.props

    let totalTax = 0

    taxes && taxes.map(val => {
        if (!val.compound_tax) {
            totalTax += getTaxValue(val.percent)
        }
    })

    return totalTax
}

function getCompoundTaxValue(tax) {
    return (tax * JSON.parse(totalAmount())) / 100
}

function invoiceCompoundTax() {
    const { formValues: { taxes } } = invoiceRefs?.props

    let totalTax = 0

    taxes && taxes.map(val => {
        if (val.compound_tax) {
            totalTax += getCompoundTaxValue(val.percent)
        }
    })

    return totalTax
}

function totalDiscount() {
    const { formValues: { discount, discount_type } } = invoiceRefs?.props

    let discountPrice = 0

    if (discount_type === 'percentage') {
        discountPrice = ((discount * invoiceSubTotal()) / 100)
    } else {
        discountPrice = (discount * 100)
    }

    return discountPrice
}

function invoiceItemTotalTaxes() {
    const { invoiceItems } = invoiceRefs?.props
    let taxes = []
    invoiceItems.map(val => {
        val.taxes && val.taxes.filter(tax => {
            let hasSame = false
            const { tax_type_id, id, amount } = tax

            taxes = taxes.map(tax2 => {
                if ((tax_type_id || id) === tax2.tax_type_id) {
                    hasSame = true
                    return {
                        ...tax2,
                        amount: amount + tax2.amount,
                        tax_type_id: tax2.tax_type_id
                    }
                }
                return tax2
            })

            if (!hasSame) {
                taxes.push({ ...tax, tax_type_id: (tax_type_id || id) })
            }
        })
    })
    return taxes
}

function subTotal() {
    let invoiceTax = 0
    invoiceItemTotalTaxes().filter(val => {
        invoiceTax += val.amount
    })
    return (invoiceSubTotal() + invoiceTax) - totalDiscount()
}

function getTaxName(tax) {
    const { taxTypes } = invoiceRefs?.props
    let taxName = ''
    const type = taxTypes.filter(val => val.fullItem.id === tax.tax_type_id)

    if (type.length > 0) {
        taxName = type[0]['fullItem'].name
    }
    return taxName
}

function getItemList(items) {
    const { currency } = invoiceRefs?.state

    let itemList = []

    if (typeof items !== 'undefined' && items.length != 0) {

        itemList = items.map((item) => {

            let { name, description, price } = item

            return {
                title: name,
                subtitle: {
                    title: description,
                },
                amount: price,
                currency,
                fullItem: item,
            };
        });
    }

    return itemList
}

const getTaxValue = (tax) => (tax * JSON.parse(subTotal())) / 100

const totalAmount = () => subTotal() + invoiceTax()

const finalAmount = () => totalAmount() + invoiceCompoundTax()


export {
    invoiceSubTotal,
    invoiceTax,
    invoiceCompoundTax,
    getCompoundTaxValue,
    subTotal,
    invoiceItemTotalTaxes,
    totalDiscount,
    getTaxValue,
    getTaxName,
    totalAmount,
    finalAmount,
    getItemList,
}
