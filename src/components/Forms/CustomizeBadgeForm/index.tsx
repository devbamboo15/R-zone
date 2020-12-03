import * as React from 'react';
import { connect } from 'react-redux';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import themr from 'src/helpers/themr';
import { get } from 'lodash';
import TextArea from 'src/components/FormFields/TextArea';
import Input from 'src/components/FormFields/Input';
import ReSelect from 'src/components/ReSelect';
import { Grid, Form, TextAreaProps, GridColumn } from 'semantic-ui-react';
import { deleteShare } from 'src/store/actions/share';
import styles from './styles.scss';

export interface CustomizeBadgeForm {
  title?: any;
  greeting?: string;
  post?: string;
  program?: any;
  program_name?: string;
}
export type CustomizeBadgeFormProps = IComponentProps & {
  handleChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    data: TextAreaProps
  ) => void;
  handleBlur?: (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    data: TextAreaProps
  ) => void;
  setFieldValue: any;
  values: CustomizeBadgeForm;
  errors: any;
  programs: any;
  share?: any;
  deleteShare: Function;
};

const makeOptions = (programs): any[] => {
  return programs.map(item => ({
    label: item.attributes.name,
    value: item.id,
  }));
};

const CustomizeBadgeForm = (props: CustomizeBadgeFormProps) => {
  const {
    classes,
    handleChange,
    handleBlur,
    values,
    errors,
    programs,
    setFieldValue,
    share,
  } = props;

  const options = makeOptions(programs);

  return (
    <Form>
      <Grid columns={2}>
        <GridColumn mobile={16} computer={7}>
          <ReSelect
            selectProps={{
              options,
              placeholder: 'Select Program',
              name: 'program',
              value: options.find(item => item.value === values.program),
              onChange: data => {
                setFieldValue('program', data.value);
                setFieldValue('program_name', data.label);
              },
            }}
            label="Select Program"
            errorMessage={get(errors, 'program')}
          />
        </GridColumn>
      </Grid>
      <Grid columns={2}>
        <GridColumn mobile={16} computer={7}>
          <TextArea
            textAreaProps={{
              placeholder: 'Join our Reading Program!',
              onBlur: handleBlur,
              value: values.greeting,
              onChange: handleChange,
              name: 'greeting',
            }}
            label="Greeting Text"
            errorMessage={get(errors, 'greeting')}
          />
        </GridColumn>
        <GridColumn mobile={16} computer={4}>
          <p className={classes.hintText}>
            Add a greeting to your badge. This will appear on the badge once
            it's saved. This copy can be changed anytime you want to make a new
            badge
          </p>
        </GridColumn>
      </Grid>
      <Grid columns={2}>
        <GridColumn mobile={16} computer={7}>
          <Input
            inputProps={{
              placeholder: 'Program Name',
              disabled: true,
              value: values.program_name,
            }}
            label="Program Name"
          />
        </GridColumn>
      </Grid>
      <Grid columns={2}>
        <GridColumn mobile={16} computer={7}>
          <TextArea
            textAreaProps={{
              placeholder:
                'Sign up today to join the Summer Reading Program with the following code: BPL22',
              onBlur: handleBlur,
              value: values.post,
              onChange: handleChange,
              name: 'post',
            }}
            label="Post text"
            errorMessage={get(errors, 'post')}
          />
        </GridColumn>
        <GridColumn mobile={16} computer={4}>
          <p className={classes.hintText}>
            This is the message that will appear on the post you make to
            Facebook or Twitter.
          </p>
        </GridColumn>
      </Grid>

      {share && get(share, 'data[0]') && (
        <Grid columns={2}>
          <GridColumn mobile={16} computer={7}>
            <a
              href="#"
              onClick={() => {
                props.deleteShare();
                setFieldValue('title', '');
                setFieldValue('greeting', '');
                setFieldValue('post', '');
                setFieldValue('program', '');
                setFieldValue('program_name', '');
              }}>
              Reset to Defaults
            </a>
          </GridColumn>
        </Grid>
      )}
    </Form>
  );
};

export default connect(
  (state: IReduxState) => {
    return {
      programs: idx(state, x => x.organizer.program.programs.data) || [],
      share: idx(state, x => x.share),
    };
  },
  {
    deleteShare,
  }
)(
  themr<CustomizeBadgeFormProps>('CustomizeBadgeForm', styles)(
    CustomizeBadgeForm
  )
);
