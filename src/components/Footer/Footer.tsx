import * as React from 'react';
import cx from 'classnames';

export type FooterProps = IComponentProps & {
  position?: string;
};

class Footer extends React.Component<FooterProps> {
  render() {
    const { classes, children, position } = this.props;
    return (
      <div
        className={cx(
          classes.footer,
          position === 'absolute' ? classes.absolute : '',
          position === 'fixed' ? classes.fixed : ''
        )}>
        {children}
      </div>
    );
  }
}

export default Footer;
