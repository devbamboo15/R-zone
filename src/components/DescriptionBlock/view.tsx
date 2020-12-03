import * as React from 'react';
import cx from 'classnames';

export type Props = IComponentProps & {
  icon?: React.ReactNode;
  iconActive?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  note?: React.ReactNode;
  onClick?: () => any;
  isSelected?: boolean;
};

class DescriptionBlock extends React.Component<Props> {
  renderTitle() {
    const { title, classes } = this.props;
    if (!title) return null;
    if (typeof title === 'string') {
      return <div className={classes.title}>{title}</div>;
    }
    return title;
  }

  renderDescription() {
    const { description, classes } = this.props;
    if (!description) return null;
    if (typeof description === 'string') {
      return <div className={classes.description}>{description}</div>;
    }
    return description;
  }

  renderNote() {
    const { note, classes } = this.props;
    if (!note) return null;
    if (typeof note === 'string') {
      return <div className={classes.note}>{note}</div>;
    }
    return note;
  }

  render() {
    const { icon, classes, onClick, isSelected, iconActive } = this.props;
    return (
      <div
        className={cx(classes.wrapper, {
          [classes.selected]: isSelected,
        })}
        onClick={onClick}>
        {icon && (
          <div className={classes.iconWrapper}>
            {isSelected ? iconActive || icon : icon}
          </div>
        )}
        {this.renderTitle()}
        {this.renderDescription()}
        {this.renderNote()}
      </div>
    );
  }
}

export default DescriptionBlock;
