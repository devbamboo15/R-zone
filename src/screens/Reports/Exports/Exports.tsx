import * as React from 'react';
import { get } from 'lodash';
import themr from 'src/helpers/themr';
import { List } from 'semantic-ui-react';
import PdfFileSvg from 'src/assets/icons/pdf-file.svg';
import CSVFileSvg from 'src/assets/icons/csv-file.svg';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import Heading, { HeadingType, HeadingColor } from 'src/components/Heading';
import styles from './styles.scss';

export type ExportsProps = IComponentProps & {
  classes?: any;
  displays: any;
  onExportReport: Function;
  exportingReport: string | undefined | null;
};

const Exports = ({ classes, displays, onExportReport, exportingReport }) => {
  return (
    <div className={classes.container}>
      <List horizontal>
        {get(displays, 'activity') && (
          <List.Item>
            <Button
              colorVariant={ButtonColor.PRIMARY}
              icon={<PdfFileSvg height={30} />}
              buttonType={ButtonType.ROUND}
              buttonProps={{
                onClick: () => onExportReport('activity'),
                loading: exportingReport === 'activity',
                disabled: exportingReport && exportingReport !== 'activity',
              }}>
              <Heading
                headingProps={{ as: 'h5' }}
                colorVariant={HeadingColor.WHITE}
                type={HeadingType.BOLD_600}>
                Export Activity (PDF)
              </Heading>
            </Button>
          </List.Item>
        )}
        {get(displays, 'overview') && (
          <List.Item>
            <Button
              colorVariant={ButtonColor.PRIMARY}
              icon={<PdfFileSvg height={30} />}
              buttonType={ButtonType.ROUND}
              buttonProps={{
                onClick: () => onExportReport('overview'),
                loading: exportingReport === 'overview',
                disabled: exportingReport && exportingReport !== 'overview',
              }}>
              <Heading
                headingProps={{ as: 'h5' }}
                colorVariant={HeadingColor.WHITE}
                type={HeadingType.BOLD_600}>
                Export Overview (PDF)
              </Heading>
            </Button>
          </List.Item>
        )}
        <List.Item>
          <Button
            colorVariant={ButtonColor.PRIMARY}
            icon={<CSVFileSvg height={30} />}
            buttonType={ButtonType.ROUND}
            buttonProps={{
              onClick: () => onExportReport('all'),
              loading: exportingReport === 'all',
              disabled: exportingReport && exportingReport !== 'all',
            }}>
            <Heading
              headingProps={{ as: 'h5' }}
              colorVariant={HeadingColor.WHITE}
              type={HeadingType.BOLD_600}>
              Export All Data (CSV)
            </Heading>
          </Button>
        </List.Item>
      </List>
    </div>
  );
};
export default themr<ExportsProps>('Exports', styles)(Exports);
