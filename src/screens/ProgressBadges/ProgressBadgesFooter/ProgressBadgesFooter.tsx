import * as React from 'react';
import themr from 'src/helpers/themr';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import { Icon } from 'semantic-ui-react';
import styles from './styles.scss';

type Props = IComponentProps & {
  onCustomizeBadgeFormSubmit?: () => void;
  onCustomizeBadgeFormReset?: () => void;
  shareType: ProgressBadgesFooterType;
  onPreview?: Function;
};
export enum ProgressBadgesFooterType {
  SUBMIT_FORM = 'submit_form',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  INSTAGRAM = 'instagram',
  SNAPCHAT = 'snapchat',
  HTML_BADGES = 'html_badges',
}
class ProgressBadgesFooter extends React.Component<Props> {
  render() {
    const {
      classes,
      shareType,
      onCustomizeBadgeFormSubmit,
      onCustomizeBadgeFormReset,
      onPreview,
    } = this.props;
    return (
      <div className={classes.footer}>
        <div className={classes.left}>
          {shareType === ProgressBadgesFooterType.SUBMIT_FORM && (
            <Button
              colorVariant={ButtonColor.DANGER}
              buttonType={ButtonType.ROUND}
              buttonProps={{
                onClick: () => onCustomizeBadgeFormReset(),
                type: 'reset',
              }}>
              <Icon name="dont" />
              Cancel
            </Button>
          )}
        </div>
        <div className={classes.right}>
          {shareType === ProgressBadgesFooterType.FACEBOOK && (
            <Button
              colorVariant={ButtonColor.SECONDARY}
              buttonType={ButtonType.ROUND}
              buttonProps={{
                onClick: () => onCustomizeBadgeFormSubmit(),
              }}>
              <Icon name="share square" />
              Share on Facebook
            </Button>
          )}

          {shareType === ProgressBadgesFooterType.TWITTER && (
            <Button
              colorVariant={ButtonColor.SECONDARY}
              buttonType={ButtonType.ROUND}
              buttonProps={{
                onClick: () => onCustomizeBadgeFormSubmit(),
              }}>
              <Icon name="share square" />
              Share on Twitter
            </Button>
          )}

          {shareType === ProgressBadgesFooterType.INSTAGRAM && (
            <Button
              colorVariant={ButtonColor.SECONDARY}
              buttonType={ButtonType.ROUND}>
              <Icon name="share square" />
              Share on Instagram
            </Button>
          )}

          {shareType === ProgressBadgesFooterType.SNAPCHAT && (
            <Button
              colorVariant={ButtonColor.SECONDARY}
              buttonType={ButtonType.ROUND}>
              <Icon name="share square" />
              Share on Snapchat
            </Button>
          )}
          {/* {shareType === ProgressBadgesFooterType.FACEBOOK ||
          shareType === ProgressBadgesFooterType.TWITTER ||
          shareType === ProgressBadgesFooterType.INSTAGRAM ||
          shareType === ProgressBadgesFooterType.SNAPCHAT ||
          shareType === ProgressBadgesFooterType.HTML_BADGES ? (
            <Button
              colorVariant={ButtonColor.PRIMARY}
              buttonType={ButtonType.ROUND}>
              <Icon name="share square" />
              Share on All
            </Button>
          ) : null} */}
          {shareType === ProgressBadgesFooterType.SUBMIT_FORM && (
            <>
              <Button
                colorVariant={ButtonColor.PRIMARY}
                buttonType={ButtonType.ROUND}
                buttonProps={{
                  onClick: () => onCustomizeBadgeFormSubmit(),
                  type: 'submit',
                }}>
                <Icon name="save outline" />
                Save
              </Button>
              <Button
                colorVariant={ButtonColor.SECONDARY}
                buttonType={ButtonType.ROUND}
                buttonProps={{
                  onClick: () => onPreview(),
                }}>
                <Icon name="search" />
                Preview
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default themr<Props>('ProgressBadgesFooter', styles)(
  ProgressBadgesFooter
);
