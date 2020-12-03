import * as React from 'react';
import Heading from 'src/components/Heading';
import themr from 'src/helpers/themr';
import { Link } from 'react-router-dom';
import styles from './styles.scss';

export type TitleProps = IComponentProps & {
  icon: React.ReactElement;
  breadcrumbs?: any[];
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  children?: React.ReactChild;
};

const Title = ({
  children,
  classes,
  icon,
  onClick,
  breadcrumbs,
}: TitleProps) => {
  return (
    <div className={classes.titleContainer}>
      <div className={classes.heading} onClick={onClick}>
        <div className={classes.icon}>{icon}</div>
        <Heading>{children}</Heading>
      </div>
      <div className={classes.breadcrumb}>
        {breadcrumbs &&
          breadcrumbs.length > 0 &&
          breadcrumbs.map((bc, index) => (
            <span key={index}>
              {bc.url ? (
                <Link className={bc.url ? classes.activecrumb : ''} to={bc.url}>
                  {bc.name}
                </Link>
              ) : (
                <span>{bc.name}</span>
              )}
              {index !== breadcrumbs.length - 1 && <span> / </span>}
            </span>
          ))}
      </div>
    </div>
  );
};

Title.defaultProps = {
  onClick: () => {},
};

export default themr<TitleProps>('Title', styles)(Title);
