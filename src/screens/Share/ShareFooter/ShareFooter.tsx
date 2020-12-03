import * as React from 'react';
import themr from 'src/helpers/themr';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import { Icon } from 'semantic-ui-react';
import styles from './styles.scss';

type Props = IComponentProps & {
  onCustomizeBadgeFormSubmit?: () => void;
  onCustomizeBadgeFormReset?: () => void;
  shareType: ShareFooterType;
  onPreview?: Function;
};
export enum ShareFooterType {
  SUBMIT_FORM = 'submit_form',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  INSTAGRAM = 'instagram',
  SNAPCHAT = 'snapchat',
  HTML_BADGES = 'html_badges',
}
class ShareFooter extends React.Component<Props> {
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
          {shareType === ShareFooterType.SUBMIT_FORM && (
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
          {shareType === ShareFooterType.FACEBOOK && (
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

          {shareType === ShareFooterType.TWITTER && (
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

          {shareType === ShareFooterType.INSTAGRAM && (
            <Button
              colorVariant={ButtonColor.SECONDARY}
              buttonType={ButtonType.ROUND}>
              <Icon name="share square" />
              Share on Instagram
            </Button>
          )}

          {shareType === ShareFooterType.SNAPCHAT && (
            <Button
              colorVariant={ButtonColor.SECONDARY}
              buttonType={ButtonType.ROUND}>
              <Icon name="share square" />
              Share on Snapchat
            </Button>
          )}
          {/* {shareType === ShareFooterType.FACEBOOK ||
          shareType === ShareFooterType.TWITTER ||
          shareType === ShareFooterType.INSTAGRAM ||
          shareType === ShareFooterType.SNAPCHAT ||
          shareType === ShareFooterType.HTML_BADGES ? (
            <Button
              colorVariant={ButtonColor.PRIMARY}
              buttonType={ButtonType.ROUND}>
              <Icon name="share square" />
              Share on All
            </Button>
          ) : null} */}
          {shareType === ShareFooterType.SUBMIT_FORM && (
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

export default themr<Props>('ShareFooter', styles)(ShareFooter);
