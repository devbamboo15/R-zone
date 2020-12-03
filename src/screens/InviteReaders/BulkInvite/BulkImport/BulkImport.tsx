import * as React from 'react';
import themr from 'src/helpers/themr';
// import { Grid, GridColumn } from 'semantic-ui-react';
// import Button, { ButtonType } from 'src/components/Button';
import Heading, { HeadingColor, HeadingType } from 'src/components/Heading';
// import OutLookMailSvg from 'src/assets/icons/outlook_mail.svg';
// import MacMailSvg from 'src/assets/icons/mac_mail.png';
import Upload from 'src/components/Upload';
// import LedSvg from 'src/assets/icons/led.svg';
import styles from './styles.scss';
import BottomActions from '../../BottomActions';

export type BulkImportProps = IComponentProps & {
  onUploadBulk: Function;
  isUpload: boolean;
};

export interface ComponentProps {
  addUsers?: Function;
}

export const bulkInviteFileTypes = [
  '.csv',
  'text/csv',
  'application/vnd.ms-excel',
  'application/xml',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

class BulkImport extends React.Component<BulkImportProps, {}> {
  render() {
    const { classes, onUploadBulk, isUpload } = this.props;
    return (
      <>
        <div className={classes.heading}>
          <Heading
            headingProps={{ as: 'h4' }}
            type={HeadingType.NORMAL}
            colorVariant={HeadingColor.SECONDARY}>
            Want to bulk invite users? Drag and drop an .xls file below
          </Heading>
        </div>
        <Upload
          title="Drag and Drop your file here!"
          mimes={bulkInviteFileTypes}
          supportedDescription="Supported file types are: CSV, XLS, XLSX"
          onUpload={onUploadBulk}
          loading={isUpload}
        />
        {/* <Grid>
          <GridColumn>
            <div className={classes.bottomSection}>
              <div className={classes.ledIcon}>
                <LedSvg height={129} />
              </div>
              <Heading
                headingProps={{ as: 'h4' }}
                type={HeadingType.NORMAL}
                colorVariant={HeadingColor.SECONDARY}>
                Don't have one of the above files available?
                <br />
                Click one of the buttons tutorials below to get <br />
                started building one!
              </Heading>
              <div className={classes.buttons}>
                <Button
                  buttonProps={{
                    onClick: () => {},
                    className: classes.outLookButton,
                  }}
                  key="Outlook"
                  icon={<OutLookMailSvg height={30} />}
                  buttonType={ButtonType.ROUND}>
                </Button>
                <Button
                  buttonProps={{
                    onClick: () => {},
                    className: classes.macMailButton,
                  }}
                  key="Mac"
                  buttonType={ButtonType.ROUND}>
                  <img src={MacMailSvg} height={30} alt="MAC mail" />
                  <Heading
                    headingProps={{ as: 'h4' }}
                    colorVariant={HeadingColor.GRAY}
                    type={HeadingType.NORMAL}>
                    Mac Mail
                  </Heading>
                </Button>
              </div>
            </div>
          </GridColumn>
        </Grid> */}
        <BottomActions isDisabled />
      </>
    );
  }
}

export default themr<BulkImportProps>('BulkImport', styles)(BulkImport);
