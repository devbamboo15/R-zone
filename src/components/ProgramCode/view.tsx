import * as React from 'react';
import { Popup } from 'semantic-ui-react';
import cn from 'classnames';
import Label from 'src/components/FormFields/Label';
import HelperIcon from 'src/components/Helper/Icon';
import CopyIcon from 'assets/icons/copy_icon.svg';
import { copy } from 'src/helpers/clipboard';

export enum Size {
  NORMAL = 'normal',
  SMALL = 'small',
}

export type Props = IComponentProps & {
  label: string;
  code: string;
  copyable?: boolean;
  labelNote?: boolean;
  labelNoteText?: string;
  size?: Size;
};

export interface State {
  content: string;
}

class ProgramCode extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      content: 'Copy',
    };
  }

  render() {
    const {
      label = 'Program Code',
      code,
      copyable = false,
      classes,
      labelNote,
      labelNoteText,
      size = 'normal',
    } = this.props;
    const { content } = this.state;

    return (
      <>
        <div className={classes.programCodeLabel}>
          <Label>
            {label}
            {labelNote && (
              <HelperIcon
                style={{
                  marginLeft: '10px',
                  position: 'relative',
                  top: '3px',
                }}
                helperText={labelNoteText}
              />
            )}
          </Label>
        </div>
        <div className={classes.programCodeContainer}>
          <input
            disabled
            readOnly
            id="copycode"
            className={cn(classes.programCode, {
              [classes.normal]: size === Size.NORMAL,
              [classes.small]: size === Size.SMALL,
            })}
            value={code}
          />
          {copyable && (
            <Popup
              on="hover"
              size="mini"
              trigger={
                <div
                  className={classes.copyIcon}
                  onClick={() => {
                    this.setState({ content: 'Copied' });
                    copy(code);
                  }}>
                  <CopyIcon height={20} />
                </div>
              }
              content={content}
              position="bottom center"
            />
          )}
        </div>
      </>
    );
  }
}

export default ProgramCode;
