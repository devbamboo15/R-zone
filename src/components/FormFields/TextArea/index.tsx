import * as React from 'react';
import themr from 'src/helpers/themr';
import {
  FormField,
  TextAreaProps,
  TextArea as BaseTextArea,
  GridColumn,
} from 'semantic-ui-react';
import Label from 'src/components/FormFields/Label';
import styles from './styles.scss';

export type BaseTextAreaProps = IComponentProps & {
  textAreaProps: TextAreaProps;
  errorMessage?: string;
  label?: string;
};

class TextArea extends React.Component<BaseTextAreaProps, {}> {
  render() {
    const { classes, textAreaProps, errorMessage, label } = this.props;
    return (
      <>
        <GridColumn>
          <FormField className={classes.column}>
            {label && (
              <Label classes={{ labelStyle: classes.label }}>{label}</Label>
            )}
            <BaseTextArea {...textAreaProps} />
          </FormField>
        </GridColumn>
        {errorMessage && (
          <GridColumn className={classes.errorMessage}>
            {errorMessage}
          </GridColumn>
        )}
      </>
    );
  }
}

export default themr<BaseTextAreaProps>('TextArea', styles)(TextArea);
