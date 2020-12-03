import * as React from 'react';
import Modal, { BaseModalProps } from 'src/components/Modal';
import themr from 'src/helpers/themr';
import { Grid } from 'semantic-ui-react';
import styles from './styles.scss';

export type AwardModalProps = IComponentProps & BaseModalProps;

const AwardModal = ({ modelProps }: AwardModalProps) => (
  <Modal modelProps={{ ...modelProps }}>
    <Grid>In Progress</Grid>
  </Modal>
);

export default themr<AwardModalProps>('AwardModal', styles)(AwardModal);
