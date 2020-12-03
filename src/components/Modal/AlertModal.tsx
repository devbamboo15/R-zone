import * as React from 'react';
import Modal, { BaseModalProps } from 'src/components/Modal';
import themr from 'src/helpers/themr';
import Heading, { HeadingColor, HeadingType } from 'src/components/Heading';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import { Grid } from 'semantic-ui-react';
import styles from './styles.scss';

export type AlertModalProps = IComponentProps &
  BaseModalProps & {
    onSave: Function;
    onCancel?: Function;
    saveTxt?: string;
    discardTxt?: string;
    text: string;
  };

const AlertModal = ({
  modelProps,
  classes,
  text,
  onSave,
  onCancel,
  saveTxt,
  discardTxt,
}: AlertModalProps) => (
  <Modal
    modelProps={{ ...modelProps, className: classes.alertStyle }}
    contentProps={{ className: classes.alertStyle }}>
    <Grid>
      <Grid.Column width={12} verticalAlign="middle">
        <Heading
          headingProps={{ as: 'h4' }}
          type={HeadingType.NORMAL}
          colorVariant={HeadingColor.WHITE}>
          {text}
        </Heading>
      </Grid.Column>
      <Grid.Column width={2}>
        <Button
          buttonType={ButtonType.ROUND}
          colorVariant={ButtonColor.PRIMARY}
          buttonProps={{ onClick: onSave as any }}>
          {saveTxt || 'Save'}
        </Button>
      </Grid.Column>
      <Grid.Column width={2}>
        <Button
          buttonType={ButtonType.ROUND}
          colorVariant={ButtonColor.DANGER}
          buttonProps={{ onClick: onCancel as any }}>
          {discardTxt || 'Discard'}
        </Button>
      </Grid.Column>
    </Grid>
  </Modal>
);

export default themr<AlertModalProps>('AlertModal', styles)(AlertModal);
