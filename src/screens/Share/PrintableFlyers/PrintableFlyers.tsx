import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';

export type PrintableFlyersProps = IComponentProps & {
  programs?: any;
  share?: any;
  auth?: any;
};

class PrintableFlyers extends React.Component<PrintableFlyersProps> {
  render() {
    const { classes } = this.props;
    const RZFlyersLarge = '/files/RZ_Flyers_2020_8.5x11_Fillable.pdf';
    const RZFlyersMedium = '/files/RZ_Flyers_2020_RZ_1-2page_Fillable.pdf';
    const RZFlyersSmall = '/files/RZ_Flyers_2020_RZ_1-4page_Fillable.pdf';

    const renderIframe = fileUrl => {
      return <iframe src={fileUrl} title="test" />;
    };
    const renderDownloadButton = (fileUrl, fileName) => {
      return (
        <Button
          colorVariant={ButtonColor.SECONDARY}
          buttonType={ButtonType.ROUND}
          buttonProps={{
            onClick: () => {
              const element = document.createElement('a');
              element.setAttribute('href', fileUrl);
              element.setAttribute('download', fileName);
              element.style.display = 'none';
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            },
          }}>
          Download
        </Button>
      );
    };

    return (
      <div>
        <div className={classes.inner}>
          <Grid>
            <>
              <Grid.Column mobile={16} computer={4}>
                {renderIframe(RZFlyersSmall)}
                {renderDownloadButton(
                  RZFlyersSmall,
                  'RZ_Flyers_2020_RZ_1-4page_Fillable'
                )}
              </Grid.Column>
              <Grid.Column mobile={16} computer={6}>
                {renderIframe(RZFlyersLarge)}
                {renderDownloadButton(
                  RZFlyersLarge,
                  'RZ_Flyers_2020_8.5x11_Fillable.pdf'
                )}
              </Grid.Column>
              <Grid.Column mobile={16} computer={5}>
                {renderIframe(RZFlyersMedium)}
                {renderDownloadButton(
                  RZFlyersMedium,
                  'RZ_Flyers_2020_RZ_1-2page_Fillable.pdf'
                )}
              </Grid.Column>
            </>
          </Grid>
        </div>
      </div>
    );
  }
}

export default PrintableFlyers;
