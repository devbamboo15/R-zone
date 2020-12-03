import * as React from 'react';
import themr from 'src/helpers/themr';
import styles from './styles.scss';

export type Props = IComponentProps & {
  size?: number;
  color?: string;
};

class Spinner extends React.Component<Props> {
  static defaultProps = {
    size: 40,
    color: '#17a4e0',
  };

  render() {
    const { classes, size, color } = this.props;
    return (
      <div className={classes.wrapper}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 38 38"
          xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient
              x1="8.042%"
              y1="0%"
              x2="65.682%"
              y2="23.865%"
              id="a">
              <stop stopColor={color} stopOpacity="0" offset="0%" />
              <stop stopColor={color} stopOpacity=".631" offset="63.146%" />
              <stop stopColor={color} offset="100%" />
            </linearGradient>
          </defs>
          <g fill="none" fillRule="evenodd">
            <g transform="translate(1 1)">
              <path
                d="M36 18c0-9.94-8.06-18-18-18"
                id="Oval-2"
                stroke={color}
                strokeWidth="2"
                transform="rotate(347.997 18 18)">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 18 18"
                  to="360 18 18"
                  dur="0.9s"
                  repeatCount="indefinite"
                />
              </path>
              <circle
                fill="#fff"
                cx="36"
                cy="18"
                r="1"
                transform="rotate(347.997 18 18)">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 18 18"
                  to="360 18 18"
                  dur="0.9s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          </g>
        </svg>
      </div>
    );
  }
}

export default themr<Props>('Spinner', styles)(Spinner);
