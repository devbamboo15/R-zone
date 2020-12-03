import * as React from 'react';
import cx from 'classnames';

export type Props = IComponentProps & {
  customClass?: any;
};

class Placeholder extends React.Component<Props> {
  render() {
    const { children, classes, customClass } = this.props;
    return <div className={cx(classes.wrapper, customClass)}>{children}</div>;
  }
}

export default Placeholder;
