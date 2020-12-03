import * as React from 'react';
import themr from 'src/helpers/themr';
import { List } from 'semantic-ui-react';
import InviteWhiteSvg from 'assets/icons/invite_white.svg';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import Heading, { HeadingType, HeadingColor } from 'src/components/Heading';
import styles from './styles.scss';

export type BottomActionsProps = IComponentProps & {
  classes?: any;
  isDisabled?: boolean;
  onClick?: Function;
  onClickPreviewEmail?: Function;
};
const BottomActions = ({ classes, isDisabled, onClick }) => {
  return (
    <div className={classes.container}>
      <List horizontal>
        {/* <List.Item>
          <Button
            buttonProps={{
              disabled: isDisabled,
              primary: false,
              onClick: onClickPreviewEmail,
            }}
            colorVariant={isDisabled ? ButtonColor.GRAY : ButtonColor.DANGER}
            icon={<InviteWhiteSvg className={classes.icon} />}
            buttonType={ButtonType.ROUND}>
            <Heading
              headingProps={{ as: 'h4' }}
              colorVariant={HeadingColor.WHITE}
              type={HeadingType.NORMAL}>
              Preview Email
            </Heading>
          </Button>
        </List.Item> */}
        <List.Item>
          <Button
            buttonProps={{
              disabled: isDisabled,
              primary: false,
              onClick,
            }}
            colorVariant={isDisabled ? ButtonColor.GRAY : ButtonColor.SECONDARY}
            icon={<InviteWhiteSvg className={classes.icon} />}
            buttonType={ButtonType.ROUND}>
            <Heading
              headingProps={{ as: 'h4' }}
              colorVariant={HeadingColor.WHITE}
              type={HeadingType.NORMAL}>
              Send All Invites
            </Heading>
          </Button>
        </List.Item>
      </List>
    </div>
  );
};
export default themr<BottomActionsProps>('BottomActions', styles)(
  BottomActions
);
