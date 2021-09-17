import {INavigation, ITheme} from '@/interfaces';

export interface IProps {
  /**
   * A navigator is an object of navigation functions that a view can call.
   * @see INavigation
   */
  navigation: INavigation;

  /**
   * dispatch change action.
   */
  dispatch: (fun: object) => void;

  /**
   * onSubmit handler.
   * It will run validation, both sync and async, and, if the form is valid, it will call this.props.onSubmit(data) with the contents of the form data.
   */
  handleSubmit: (fun: object) => void;

  /**
   * An active theme object.
   * @see ITheme
   */
  theme: ITheme;

  /**
   * Gets form data.
   */
  formValues: any;

  /**
   * The loading fetching customizes.
   */
  isLoading: Boolean;

  /**
   * The loading indicator for the button.
   */
  loading: boolean;
}

export interface IStates {
  /**
   * current active tab
   */
  activeTab: string;
}
