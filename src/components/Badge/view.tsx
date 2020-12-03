import * as React from 'react';
import cn from 'classnames';
import themr from 'src/helpers/themr';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import iconBadge from 'src/assets/images/icon.png';
import logoReaderZone from 'src/assets/images/logo_reader_zone.png';
import toast from 'src/helpers/Toast';
import styles from './styles.scss';

export type BadgeProps = IComponentProps & {
  badgeSize: BadgeSize;
  badgeType?: BadgeType;
  isSpecial?: boolean;
  program?: any;
  share?: any;
  auth?: any;
  customIframe?: any;
  dontUseWrapper?: boolean;
  customContent?: any;
};

export enum BadgeSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  X_LAGER = 'x_large',
}
export enum BadgeType {
  HTML = 'HTML',
}
class Badge extends React.Component<BadgeProps> {
  handleCopy = (e, text) => {
    e.preventDefault();
    navigator.clipboard.writeText(text);
    toast.success('Copied!');
  };

  render() {
    const {
      classes,
      badgeSize,
      badgeType,
      isSpecial,
      program,
      share,
      auth,
      children,
      customIframe,
      dontUseWrapper,
      customContent,
    } = this.props;

    const userShare = {
      title_text: program.attributes.name,
      greeting_text: 'Join Public Library in our',
      code: program.attributes.code,
      post_text: `Download the app today and join with this code:`,
    };

    const shared = share.data.find(item => {
      return item.attributes.program_id === program.id * 1;
    });

    if (shared) {
      // userShare.title_text = shared.attributes.title_text;
      userShare.greeting_text = shared.attributes.greeting_text;
      userShare.post_text = shared.attributes.post_text;
    }
    const iframeUrl = `${process.env.API_BASE_URL}${`/user/share/${
      auth ? auth.id : 'auth_id'
    }/${program.id}`}`;

    return (
      <>
        <div
          className={
            dontUseWrapper
              ? ''
              : cn(classes.coupon, classes.sizeLarge, classes.couponSpecial, {
                  [classes.sizeSmall]: badgeSize === BadgeSize.SMALL,
                  [classes.sizeMedium]: badgeSize === BadgeSize.MEDIUM,
                  [classes.sizeLarge]: badgeSize === BadgeSize.LARGE,
                  [classes.sizeXLarge]: badgeSize === BadgeSize.X_LAGER,
                  [classes.couponSpecial]: isSpecial,
                })
          }>
          {children || (
            <>
              <div>
                <img
                  src={logoReaderZone}
                  className={classes.logoReaderZone}
                  alt="Reader Zone"
                />
              </div>
              <div>
                <img
                  src={iconBadge}
                  className={classes.iconBadge}
                  alt="Icon Badge"
                />
              </div>
              <div className={classes.content}>
                <h3>{userShare.greeting_text}</h3>
                <h2>{userShare.title_text}</h2>
                {customContent ? (
                  customContent.split('\n').map((item, i) => {
                    return (
                      <p className={classes.textGuide} key={i}>
                        {item}
                      </p>
                    );
                  })
                ) : (
                  <>
                    <p className={classes.textGuide}>{userShare.post_text}</p>

                    <h1 className={classes.code}>{userShare.code}</h1>
                  </>
                )}
              </div>
              {badgeType === BadgeType.HTML && (
                <div className={classes.triangle} />
              )}
            </>
          )}
        </div>
        {badgeType === BadgeType.HTML && (
          <div className={classes.clipboard}>
            <div className={classes.buttonCopy}>
              <Button
                colorVariant={ButtonColor.MAIN}
                buttonType={ButtonType.ROUND}
                buttonProps={{
                  onClick: e => {
                    const text =
                      customIframe ||
                      `<iframe width="240" height="440" src="${iframeUrl}" frameborder="0"></iframe>`;
                    this.handleCopy(e, text);
                  },
                }}>
                Copy to Clipboard
              </Button>
            </div>

            <p className={classes.clipboardContent}>
              {badgeSize === BadgeSize.LARGE && (
                <>
                  {customIframe || (
                    <>
                      &lt;iframe with="240" height="440" src="
                      {`${iframeUrl}?size=240x440&icon=true`}" frameborder="0"
                      &gt; &lt;/iframe&gt;
                    </>
                  )}
                </>
              )}

              {badgeSize === BadgeSize.SMALL && (
                <>
                  {customIframe || (
                    <>
                      &lt;iframe with="380" height="290" src="
                      {`${iframeUrl}?size=380x290&icon=false`}" frameborder="0"
                      &gt; &lt;/iframe&gt;
                    </>
                  )}
                </>
              )}

              {badgeSize === BadgeSize.MEDIUM && (
                <>
                  {customIframe || (
                    <>
                      &lt;iframe with="310" height="440" src="
                      {`${iframeUrl}?size=310x440&icon=true`}" frameborder="0"
                      &gt; &lt;/iframe&gt;
                    </>
                  )}
                </>
              )}
            </p>
          </div>
        )}
      </>
    );
  }
}
export default themr<BadgeProps>('Badge', styles)(Badge);
