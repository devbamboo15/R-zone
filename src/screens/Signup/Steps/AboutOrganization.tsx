import * as React from 'react';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import forEach from 'lodash/forEach';
import omit from 'lodash/omit';
import themr from 'src/helpers/themr';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import { Form, Grid } from 'semantic-ui-react';
import Input from 'src/components/FormFields/Input';
import Select from 'src/components/FormFields/Select';
import Checkbox from 'src/components/FormFields/Checkbox';
import Countries from 'src/helpers/countries';
import StatesList from 'src/helpers/states';
import urls from 'src/helpers/urls';
import * as queryString from 'query-string';
import get from 'lodash/get';
import * as H from 'history';
import styles from '../styles.scss';

type Props = IComponentProps & {
  onNext: Function;
  onPrev: Function;
  registerInProgress: boolean;
  history: H.History;
  jumpToPreviousStep?: Function;
  organizerData?: any;
};

const organizationType = [
  { text: 'School', value: 'school' },
  { text: 'School Library', value: 'school-library' },
  { text: 'Public Library', value: 'public-library' },
  { text: 'Classroom', value: 'classroom' },
  { text: 'Family', value: 'Family' },
  { text: 'Book Club', value: 'book-club' },
  { text: 'Other', value: 'other' },
];

class AboutOrganization extends React.Component<Props> {
  render() {
    const {
      classes,
      onNext,
      registerInProgress,
      history,
      organizerData,
    } = this.props;

    const params = queryString.parse(history.location.search);
    const preSelectedPlanid = get(params, 'pre_selected_planid');

    const countries = [];
    forEach(Countries, (name, code) => {
      countries.push({
        value: code,
        text: name,
      });
    });

    let initialValues: any = {
      name: '',
      organization_type: '',
      country: '',
      state: '',
      terms: true,
      phone: '',
    };
    if (!preSelectedPlanid) {
      initialValues = {
        ...initialValues,
        numberOfReaders: 20,
      };
    }

    if (organizerData) initialValues = organizerData;

    return (
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={values => {
          onNext(omit(values, ['terms']));
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required('Organization name is required'),
          organization_type: Yup.string().required(
            'Please select Organization Type'
          ),
          country: Yup.string().required('Please select Country'),
          state: Yup.mixed().when('country', {
            is: country => !!StatesList[country],
            then: Yup.string().required('Please select State'),
            otherwise: Yup.string(),
          }),
          terms: Yup.boolean().oneOf(
            [true],
            'Must Accept Terms and Conditions'
          ),
        })}>
        {formProps => {
          const { values } = formProps;
          const { touched } = formProps;
          const { errors } = formProps;
          const states = [];
          forEach(StatesList[values.country], (name, code) => {
            states.push({
              value: code,
              text: name,
            });
          });
          return (
            <Form
              onSubmit={formProps.handleSubmit}
              className={classes.aboutOrganization}
              error>
              <Grid>
                <Grid.Column>
                  <Input
                    label="Name"
                    inputProps={{
                      placeholder: 'John',
                      name: 'name',
                      value: values.name,
                      onChange: formProps.handleChange,
                      onBlur: formProps.handleBlur,
                    }}
                    errorMessage={touched.name && errors.name}
                  />
                </Grid.Column>
              </Grid>
              <Grid>
                <Grid.Column>
                  <Select
                    label="Organization Type"
                    selectProps={{
                      options: organizationType,
                      placeholder: 'Please Select',
                      value: values.organization_type,
                      onChange: (_, data) => {
                        formProps.setFieldValue(
                          'organization_type',
                          data.value
                        );
                        formProps.setFieldTouched('organization_type');
                      },
                    }}
                    errorMessage={
                      touched.organization_type && errors.organization_type
                    }
                  />
                </Grid.Column>
              </Grid>
              <Grid columns="3" doubling>
                <Grid.Column>
                  <Select
                    label="Country"
                    selectProps={{
                      placeholder: 'Please Select',
                      options: countries,
                      value: values.country,
                      search: true,
                      onChange: (_, data) => {
                        formProps.setFieldValue('country', data.value);
                        formProps.setFieldValue('state', '');
                        formProps.setFieldTouched('country');
                      },
                    }}
                    errorMessage={touched.country && errors.country}
                  />
                </Grid.Column>
                {values.country && states.length > 0 && (
                  <Grid.Column>
                    <Select
                      label="State"
                      selectProps={{
                        placeholder: 'Please Select',
                        options: states,
                        search: true,
                        value: values.state,
                        onChange: (_, data) => {
                          formProps.setFieldValue('state', data.value);
                          formProps.setFieldTouched('state');
                        },
                      }}
                      errorMessage={touched.state && errors.state}
                    />
                  </Grid.Column>
                )}
                <Grid.Column>
                  <Input
                    label="Phone (optional)"
                    inputProps={{
                      placeholder: 'Your Phone',
                      name: 'phone',
                      value: values.phone,
                      onChange: formProps.handleChange,
                      onBlur: formProps.handleBlur,
                    }}
                    errorMessage={touched.name && errors.phone}
                  />
                </Grid.Column>
              </Grid>
              {!preSelectedPlanid && (
                <Grid>
                  <Grid.Column>
                    <Select
                      label="Number of Readers"
                      selectProps={{
                        options: [
                          {
                            text: 'Up to 20',
                            value: 20,
                          },
                          {
                            text: 'Up to 50',
                            value: 50,
                          },
                          {
                            text: 'Up to 499',
                            value: 499,
                          },
                          {
                            text: 'Up to 750',
                            value: 750,
                          },
                          {
                            text: 'Up to 2500',
                            value: 2500,
                          },
                          {
                            text: 'Up to 5000',
                            value: 5000,
                          },
                          {
                            text: 'Up to 9999',
                            value: 9999,
                          },
                          {
                            text: '10000+',
                            value: 10000,
                          },
                        ],
                        placeholder: 'Please Select',
                        value: values.numberOfReaders,
                        onChange: (_, data) => {
                          formProps.setFieldValue(
                            'numberOfReaders',
                            data.value
                          );
                          formProps.setFieldTouched('numberOfReaders');
                        },
                      }}
                      errorMessage={
                        touched.numberOfReaders && errors.numberOfReaders
                      }
                    />
                  </Grid.Column>
                </Grid>
              )}
              <Grid>
                <Grid.Column>
                  <Checkbox
                    checkboxProps={{
                      toggle: true,
                      checked: values.terms,
                      label: (
                        <label>
                          <a
                            href="https://readerzone.webflow.io/terms-conditions"
                            target="_blank"
                            rel="noopener noreferrer">
                            Please accept the terms & Conditions
                          </a>
                        </label>
                      ),
                      onChange: (_, { checked }) => {
                        formProps.setFieldValue('terms', checked);
                      },
                    }}
                    errorMessage={touched.terms && (errors.terms as any)}
                  />
                </Grid.Column>
              </Grid>
              <div className={classes.center}>
                <div style={{ float: 'left' }}>
                  <a
                    href="#"
                    className={classes.back}
                    onClick={() => {
                      this.props.jumpToPreviousStep();
                      this.props.onPrev(values);
                    }}>
                    Back
                  </a>
                </div>
                <Button
                  colorVariant={ButtonColor.SECONDARY}
                  buttonType={ButtonType.ROUND}
                  buttonProps={{
                    size: 'large',
                    type: 'submit',
                    loading: registerInProgress,
                  }}>
                  Next
                </Button>
                <p>
                  {preSelectedPlanid ? (
                    <Link
                      to={`${urls.LOGIN()}?pre_selected_planid=${preSelectedPlanid}`}>
                      I already have an account
                    </Link>
                  ) : (
                    <Link to={urls.LOGIN()}>I already have an account</Link>
                  )}
                </p>
              </div>
            </Form>
          );
        }}
      </Formik>
    );
  }
}

export default themr<Props>('AboutOrganization', styles)(AboutOrganization);
