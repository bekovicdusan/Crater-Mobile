import React, {Component} from 'react';
import RNPickerSelect from 'react-native-picker-select';
import {connect} from 'react-redux';
import {colors} from '@/styles';
import {hasTextLength, hasValue} from '@/constants';
import {commonSelector} from 'stores/common/selectors';
import {BaseSelect} from '@/components';

type IProps = {
  disabled: boolean,
  input: any,
  meta: Object,
  defaultPickerOptions: Object,
  items: Array<Object>,
  onChangeCallback: Function,
  callbackWhenMount: Function,
  refLinkFn: Function,
  onDonePress: Function,
  doneText: string,
  fieldIcon: string,
  containerStyle: Object,
  label: String,
  isRequired: Boolean,
  placeholderTextColor: String
};

class Picker extends Component<IProps> {
  constructor(props) {
    super(props);
    this.state = {
      selectedItemValue: ''
    };
  }

  componentDidMount() {
    const {
      input: {value, onChange},
      onChangeCallback,
      callbackWhenMount
    } = this.props;

    onChange(value);
    this.setState({selectedItemValue: value});
    callbackWhenMount ? callbackWhenMount?.() : onChangeCallback?.(value);
  }

  onChange = v => {
    const {
      onChangeCallback,
      input: {onChange}
    } = this.props;

    onChange(v);

    this.setState({selectedItemValue: v});
    onChangeCallback && onChangeCallback(v);
  };

  onDonePress = () => {
    const {onDonePress} = this.props;
    onDonePress?.();
  };

  render() {
    const {
      input: {value},
      meta,
      items,
      disabled,
      isRequired,
      refLinkFn,
      doneText,
      fieldIcon,
      defaultPickerOptions,
      label,
      findValueByForm = true,
      placeholderTextColor = colors.darkGray,
      baseSelectProps,
      customView
    } = this.props;

    const {selectedItemValue} = this.state;
    let selected = [];

    if (findValueByForm)
      selected = items && items.find(item => item.value === value);
    else
      selected = items && items.find(item => item.value === selectedItemValue);

    let selectedLabel = selected && (selected.displayLabel || selected.label);
    let selectedValue = selected && selected.value;

    let placeHolder = {
      ...{color: colors.darkGray},
      ...defaultPickerOptions
    };

    const placeholderText =
      defaultPickerOptions?.displayLabel ||
      defaultPickerOptions?.label ||
      label;
    const valuesText = hasTextLength(selectedLabel) ? selectedLabel : null;

    return (
      <RNPickerSelect
        placeholder={defaultPickerOptions && placeHolder}
        items={items.map(item => ({...item, color: colors.secondary}))}
        onValueChange={v => this.onChange(v)}
        value={typeof selectedValue !== 'undefined' && selectedValue}
        placeholderTextColor={placeholderTextColor}
        ref={(dropdownRef = {}) => {
          refLinkFn?.({
            ...dropdownRef,
            focus: () => dropdownRef?.togglePicker?.()
          });
        }}
        modalProps={{animationType: 'slide'}}
        disabled={disabled}
        onDonePress={() => this.onDonePress()}
        doneText={doneText}
      >
        {customView ? (
          customView({placeholderText, valuesText})
        ) : (
          <BaseSelect
            meta={meta}
            label={label}
            isRequired={isRequired}
            icon={fieldIcon}
            disabled={disabled}
            rightIcon={'angle-down'}
            disabled={disabled}
            placeholder={placeholderText}
            values={valuesText}
            {...baseSelectProps}
          />
        )}
      </RNPickerSelect>
    );
  }
}

const mapStateToProps = state => ({
  ...commonSelector(state)
});

export const SelectPickerField = connect(mapStateToProps)(Picker);
