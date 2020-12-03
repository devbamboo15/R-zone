import * as React from 'react';
import { Formik } from 'formik';
import { Form, Grid, Segment } from 'semantic-ui-react';
import get from 'lodash/get';
import Footer from 'src/components/Footer';
import Input from 'src/components/FormFields/Input';
import Select from 'src/components/FormFields/Select';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import Checkbox from 'src/components/FormFields/Checkbox';
import Countries from 'src/helpers/countries';
import StatesList from 'src/helpers/states';
import forEach from 'lodash/forEach';
import CancelIcon from 'assets/icons/cancel.svg';
import * as Yup from 'yup';

import SaveIcon from 'assets/icons/save.svg';

export type OrganizationProps = IComponentProps & {
  organization: any;
  doUpdateAccount: Function;
  isSaving: boolean;
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

class Organization extends React.Component<OrganizationProps> {
  updateOrganization = organization => {
    this.props.doUpdateAccount({ organization });
  };

  render() {
    const { classes, organization, isSaving } = this.props;
    const countries = [];
    forEach(Countries, (name, code) => {
      countries.push({
        value: code,
        text: name,
      });
    });
    return (
      <div>
        <Formik
          initialValues={organization}
          validationSchema={Yup.object().shape({
            postal_code: Yup.string()
              .nullable()
              .matches(/^\d+$/, 'Zip Code only allow digit')
              .test(
                'len',
                'Please enter 5 digit Zip Code',
                val => !val || val.length === 5
              ),
            phone: Yup.string()
              .nullable()
              .matches(/^\d+$/, 'Phone only allow digit')
              .test(
                'len',
                'Please enter maximum 10 digits',
                val => !val || val.length <= 10
              ),
          })}
          onSubmit={this.updateOrganization}>
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            setFieldTouched,
            errors,
            touched,
            dirty,
            isValid,
            handleReset,
            /* and other goodies */
          }) => {
            const states = [];
            forEach(StatesList[values.country], (name, code) => {
              states.push({
                value: code,
                text: name,
              });
            });
            return (
              <Form onSubmit={handleSubmit}>
                <Grid columns={4}>
                  <Input
                    inputProps={{
                      placeholder: 'Organization Name',
                      onChange: handleChange,
                      onBlur: handleBlur,
                      value: values.name,
                      name: 'name',
                    }}
                    label="Organization Name"
                  />
                  <Select
                    selectProps={{
                      options: organizationType,
                      placeholder: 'Organization Type',
                      onChange: (_, data) => {
                        setFieldValue('organization_type', data.value);
                        setFieldTouched('organization_type');
                      },
                      value: values.organization_type,
                      name: 'organization_type',
                    }}
                    label="Organization Type"
                  />
                </Grid>
                <Grid columns={4}>
                  <Select
                    selectProps={{
                      options: countries,
                      placeholder: 'Country',
                      search: true,
                      onChange: (_, data) => {
                        setFieldValue('country', data.value);
                        setFieldValue('state', '');
                        setFieldTouched('country');
                      },
                      value: values.country,
                      name: 'country',
                    }}
                    label="Country"
                  />
                  {(!values.country || states.length > 0) && (
                    <Select
                      selectProps={{
                        options: states,
                        search: true,
                        placeholder: 'State',
                        onChange: (_, data) => {
                          setFieldValue('state', data.value);
                          setFieldTouched('state');
                        },
                        value: values.state,
                        name: 'state',
                      }}
                      label="State"
                    />
                  )}
                </Grid>
                <Grid columns={4}>
                  <Input
                    inputProps={{
                      placeholder: 'City',
                      onChange: handleChange,
                      onBlur: handleBlur,
                      value: values.city || '',
                      name: 'city',
                    }}
                    label="City"
                  />
                  <Input
                    inputProps={{
                      placeholder: 'Zipcode',
                      onChange: handleChange,
                      onBlur: handleBlur,
                      value: values.postal_code || '',
                      name: 'postal_code',
                    }}
                    label="Zipcode"
                    errorMessage={touched.postal_code && errors.postal_code}
                  />
                </Grid>
                <Grid columns={2}>
                  <Input
                    inputProps={{
                      placeholder: 'Street Address',
                      onChange: handleChange,
                      onBlur: handleBlur,
                      value: values.address || '',
                      name: 'address',
                    }}
                    label="Street Address"
                  />
                </Grid>
                <Grid columns={2}>
                  <Input
                    inputProps={{
                      placeholder: 'Phone Number',
                      onChange: handleChange,
                      onBlur: handleBlur,
                      value: values.phone || '',
                      name: 'phone',
                    }}
                    label="Phone Number"
                    errorMessage={touched.phone && errors.phone}
                  />
                </Grid>

                <div className={classes.bottom_form}>
                  <Grid as={Segment} className={classes.bottomSegment}>
                    <Grid.Row className={classes.checkbox_form}>
                      <Checkbox
                        checkboxProps={{
                          checked: get(
                            values,
                            'notification_preferences.notify_special_offers',
                            true
                          ),
                          toggle: true,
                          onChange: (_, { checked }) => {
                            setFieldValue(
                              'notification_preferences.notify_special_offers',
                              checked
                            );
                          },
                        }}>
                        Send my Readers notifications of any changes to
                        Program/Groups
                      </Checkbox>
                    </Grid.Row>
                    <Grid.Row className={classes.checkbox_form}>
                      <Checkbox
                        checkboxProps={{
                          checked: get(
                            values,
                            'notification_preferences.notify_app_updates',
                            true
                          ),
                          toggle: true,
                          onChange: (_, { checked }) => {
                            setFieldValue(
                              'notification_preferences.notify_app_updates',
                              checked
                            );
                          },
                        }}>
                        Send my Readers notifications for any Completed
                        Goals/Milestones
                      </Checkbox>
                    </Grid.Row>
                    <Grid.Row className={classes.checkbox_form}>
                      <Checkbox
                        checkboxProps={{
                          checked: get(
                            values,
                            'notification_preferences.notify_org_activity',
                            true
                          ),
                          toggle: true,
                          onChange: (_, { checked }) => {
                            setFieldValue(
                              'notification_preferences.notify_org_activity',
                              checked
                            );
                          },
                        }}>
                        Send reminder emails for inactive or low-activity
                        Readers
                      </Checkbox>
                    </Grid.Row>
                  </Grid>
                </div>
                <Footer>
                  <div className="bottomBar">
                    <div className="buttonGroupContainer">
                      <Button
                        buttonProps={{
                          disabled: !dirty,
                          type: 'button',
                          onClick: () => {
                            handleReset();
                          },
                        }}
                        icon={<CancelIcon height={16} />}
                        colorVariant={ButtonColor.DANGER}
                        buttonType={ButtonType.ROUND}>
                        Cancel
                      </Button>
                      <Button
                        buttonProps={{
                          disabled: !dirty && !isValid,
                          type: 'submit',
                          loading: isSaving,
                        }}
                        icon={<SaveIcon height={16} />}
                        colorVariant={dirty && isValid && ButtonColor.PRIMARY}
                        buttonType={ButtonType.ROUND}>
                        Save
                      </Button>
                    </div>
                  </div>
                </Footer>
              </Form>
            );
          }}
        </Formik>
      </div>
    );
  }
}

export default Organization;
