import * as React from 'react';
import cn from 'classnames';
import themr from 'src/helpers/themr';
import { Header, HeaderProps } from 'semantic-ui-react';
import styles from './styles.scss';

export enum HeadingColor {
  SECONDARY = 'secondary',
  PRIMARY = 'primary',
  PRIMARY1 = 'primary1',
  MAIN = 'MAIN',
  FAID = 'faid',
  GRAY = 'gray',
  WHITE = 'white',
  PINK = 'pink',
  CYAN = 'cyan',
  BLACK = 'black',
  YELLOW = 'yellow',
  WARNING = 'warning',
  DANGER = 'danger',
}

export enum HeadingType {
  NORMAL = 'normal',
  BOLD_500 = 500,
  BOLD_600 = 600,
}

export type HeadingProps = IComponentProps & {
  Icon?: any;
  colorVariant?: HeadingColor;
  type?: HeadingType;
  headingProps?: HeaderProps;
  iconHeight?: number;
  nomargin?: boolean;
};

class Heading extends React.Component<HeadingProps, {}> {
  render() {
    const {
      children,
      headingProps,
      classes,
      Icon,
      iconHeight,
      nomargin,
      colorVariant,
      type,
    } = this.props;
    return (
      <div
        className={cn({
          [classes.iconButton]: Icon,
        })}>
        {Icon && (
          <div className={classes.selfIcon}>
            <Icon height={iconHeight} />
          </div>
        )}

        <Header
          as="h1"
          style={{ fontWeight: type }}
          {...headingProps}
          className={cn(
            {
              [classes.normalHeading]: type === HeadingType.NORMAL,
              [classes.primaryHeading]: colorVariant === HeadingColor.PRIMARY,
              [classes.primaryHeading1]: colorVariant === HeadingColor.PRIMARY1,
              [classes.mainHeading]: colorVariant === HeadingColor.MAIN,
              [classes.cyanHeading]: colorVariant === HeadingColor.CYAN,
              [classes.secondaryHeading]:
                colorVariant === HeadingColor.SECONDARY,
              [classes.faidHeading]: colorVariant === HeadingColor.FAID,
              [classes.grayHeading]: colorVariant === HeadingColor.GRAY,
              [classes.whiteHeading]: colorVariant === HeadingColor.WHITE,
              [classes.text2]: colorVariant === HeadingColor.PINK,
              [classes.blackHeading]: colorVariant === HeadingColor.BLACK,
              [classes.yellowHeading]: colorVariant === HeadingColor.YELLOW,
              [classes.warningHeading]: colorVariant === HeadingColor.WARNING,
              [classes.dangerHeading]: colorVariant === HeadingColor.DANGER,
              [classes.iconHeading]: nomargin,
            },
            headingProps ? headingProps.className : ''
          )}>
          {children}
        </Header>
      </div>
    );
  }
}

export default themr<HeadingProps>('Heading', styles)(Heading);
