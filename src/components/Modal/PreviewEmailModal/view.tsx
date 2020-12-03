import * as React from 'react';
import Modal, { BaseModalProps } from 'src/components/Modal';
import { Grid } from 'semantic-ui-react';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import Heading, { HeadingType } from 'src/components/Heading';
import Spinner from 'src/components/Spinner';
import Input from 'src/components/FormFields/Input';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { keys, get } from 'lodash';
import ReactHtmlParser from 'react-html-parser';
import Select from 'src/components/FormFields/Select';
import { IProgram } from 'src/store/types/organizer/program';
import find from 'lodash/find';
import { templateHtml } from './template';

export type PreviewEmailModalProps = IComponentProps & {
  isLoading: boolean;
  onSave: Function;
  orgName: string;
  programs: IProgram[];
};
export type PreviewEmailModalOutProps = BaseModalProps & {
  onCancel?: Function;
};
class PreviewEmailModal extends React.Component<
  PreviewEmailModalProps & PreviewEmailModalOutProps
> {
  divRef = React.createRef<HTMLDivElement>();

  onUpdateFormSubmit = (values: any) => {
    const body = this.divRef.current.innerHTML;
    this.props.onSave({
      ...values,
      body,
    });
  };

  getProgramCode = programId => {
    const { programs } = this.props;
    const foundProgram = find(programs, { id: programId }) || {};
    return get(foundProgram, 'attributes.code');
  };

  render() {
    const {
      modelProps,
      classes,
      isLoading,
      onCancel,
      orgName,
      programs,
    } = this.props;

    const programOptions = programs.map((item: any) => ({
      value: item.id,
      text: item.attributes.name,
    }));
    const defaultProgram = get(programOptions[0], 'value', '');
    const emailTemplate = templateHtml(
      orgName,
      this.getProgramCode(defaultProgram)
    );
    const initialValues = {
      subject: 'Reading Program News',
      to_addr: '',
      body: emailTemplate,
      program: defaultProgram,
    };

    return (
      <Modal modelProps={{ ...modelProps, closeIcon: true, size: 'large' }}>
        <div>
          <div className={classes.modalTop}>
            <div style={{ marginTop: 10 }}>
              <Heading headingProps={{ as: 'h3' }} type={HeadingType.BOLD_600}>
                PREVIEW EMAIL MESSAGE
              </Heading>
            </div>
          </div>
          <Grid>
            <Formik
              initialValues={{ ...initialValues }}
              enableReinitialize
              onSubmit={this.onUpdateFormSubmit}
              validationSchema={Yup.object().shape({
                to_addr: Yup.string()
                  .email('Email is not valid')
                  .required('Email is Required'),
                subject: Yup.string().required('Subject is Required'),
              })}>
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                setFieldValue,
              }) => {
                return (
                  <Form className={classes.form}>
                    <Grid>
                      <Select
                        selectProps={{
                          options: programOptions,
                          value: values.program,
                          name: 'program',
                          onChange: (_, data) => {
                            setFieldValue('program', data.value);
                            setFieldValue(
                              'body',
                              templateHtml(
                                orgName,
                                this.getProgramCode(data.value)
                              )
                            );
                          },
                          placeholder: 'Select Program',
                        }}
                        label="Select Program"
                      />
                    </Grid>
                    <Grid>
                      <Input
                        inputProps={{
                          placeholder: 'Subject Address',
                          type: 'subject',
                          onChange: handleChange,
                          onBlur: handleBlur,
                          value: values.subject,
                          name: 'subject',
                        }}
                        label="Subject"
                        errorMessage={
                          get(touched, 'subject') && get(errors, 'subject')
                        }
                      />
                    </Grid>
                    <div className={classes.divider} />
                    <Grid.Row>
                      <div
                        className={classes.editor}
                        contentEditable
                        ref={this.divRef}
                        suppressContentEditableWarning>
                        {ReactHtmlParser(values.body)}
                      </div>
                    </Grid.Row>
                    <div className={classes.divider} />
                    <Grid>
                      <Input
                        inputProps={{
                          placeholder: 'Enter test email here',
                          type: 'to_addr',
                          onChange: handleChange,
                          onBlur: handleBlur,
                          value: values.email,
                          name: 'to_addr',
                        }}
                        label={null}
                        errorMessage={
                          get(touched, 'to_addr') && get(errors, 'to_addr')
                        }
                      />
                    </Grid>
                    <Grid>
                      <Grid.Row textAlign="center" verticalAlign="middle">
                        <div className={classes.bottomButtons}>
                          <Button
                            colorVariant={ButtonColor.GRAY}
                            buttonType={ButtonType.ROUND}
                            buttonProps={{
                              type: 'button',
                              onClick: () => onCancel(),
                            }}>
                            Cancel
                          </Button>
                          <Button
                            colorVariant={ButtonColor.PRIMARY}
                            buttonType={ButtonType.ROUND}
                            buttonProps={{
                              loading: isLoading,
                              disabled: keys(errors).length !== 0,
                              type: 'submit',
                            }}>
                            Send Test Email
                          </Button>
                        </div>
                      </Grid.Row>
                    </Grid>
                  </Form>
                );
              }}
            </Formik>
          </Grid>
        </div>
        {isLoading && (
          <div className={classes.loadingContainer}>
            <Spinner />
          </div>
        )}
      </Modal>
    );
  }
}
export default PreviewEmailModal;
