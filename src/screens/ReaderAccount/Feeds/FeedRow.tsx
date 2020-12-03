import * as React from 'react';
import { Formik } from 'formik';
import cx from 'classnames';
import * as Yup from 'yup';
import themr from 'src/helpers/themr';
import { Icon } from 'semantic-ui-react';
import Heading, { HeadingType, HeadingColor } from 'src/components/Heading';
import Input from 'src/components/FormFields/Input';
import get from 'lodash/get';
import { confirmModal } from 'src/components/Modal/ConfirmationModal';
import AwardSvg from 'src/assets/icons/feeds/Award.svg';
import BookSvg from 'src/assets/icons/feeds/Book.svg';
import EntrySvg from 'src/assets/icons/feeds/Entry.svg';
import GoalSvg from 'src/assets/icons/feeds/Goal.svg';
import ProgramSvg from 'src/assets/icons/feeds/Program.svg';
import styles from '../styles.scss';

export type Props = IComponentProps & {
  isActive: boolean;
  feed: any;
  onUpdateClick: Function;
  onUpdate: Function;
  onDelete: Function;
  readerId: string;
  userAccessProgram?: any;
};

interface IStates {
  isEditMode: boolean;
}

class FeedRow extends React.Component<Props, IStates> {
  state = {
    isEditMode: false,
  };

  getIcon = (status: string) => {
    let icon;
    let color;
    const statusStr = status ? status.replace(/\\/g, '') : '';
    switch (statusStr) {
      case 'AppDomainGoalsGoal':
        color = 'turquoise';
        icon = <GoalSvg height={20} width={20} />;
        break;
      case 'AppDomainGoalsEntry':
        color = 'gray4';
        icon = <EntrySvg height={20} width={20} />;
        break;
      case 'AppDomainAwardsUserAward':
        color = 'secondary_color';
        icon = <AwardSvg height={20} width={20} />;
        break;
      case 'AppDomainBooksBook':
        color = 'green';
        icon = <BookSvg height={20} width={20} />;
        break;
      case 'AppDomainOrganizationsProgram':
        color = 'warning';
        icon = <ProgramSvg height={20} width={20} />;
        break;
      default:
        color = 'turquoise';
        icon = <GoalSvg height={20} width={20} />;
        break;
    }
    return { icon, color };
  };

  toggleEditMode = (feedId: string) => {
    const { onUpdateClick } = this.props;
    this.setState(state => ({
      isEditMode: !state.isEditMode,
    }));
    onUpdateClick(feedId);
  };

  forceCloseEditMode = () => {
    this.setState({
      isEditMode: false,
    });
  };

  render() {
    const {
      classes,
      isActive,
      feed,
      onDelete,
      onUpdate,
      userAccessProgram,
      // readerId,
    } = this.props;
    const { isEditMode } = this.state;
    const feedId = get(feed, 'id') || '';
    const feedDate = get(feed, 'created_at') || '';
    const feedTitle = get(feed, 'data.message') || '';
    const feedType = get(feed, 'subject_type') || '';
    return (
      <div
        className={cx(classes.feedRow, { [classes.feedRowActive]: isActive })}>
        <Formik
          enableReinitialize
          initialValues={{
            message: feedTitle,
          }}
          onSubmit={values => {
            if (feedTitle !== values.message) {
              const data = {
                message: values.message,
              };
              onUpdate(feedId, data, () => {
                this.toggleEditMode('');
              });
            }
          }}
          validationSchema={Yup.object().shape({
            message: Yup.string().required('Message is required'),
          })}>
          {formProps => {
            const { values, errors, touched } = formProps;
            return (
              <div className={classes.feedItem}>
                <div className={cx(classes.flex1, classes.feedIcon)}>
                  {this.getIcon(feedType).icon}
                </div>
                <div className={cx(classes.flex25, classes.feedMessage)}>
                  {isEditMode ? (
                    <Input
                      inputProps={{
                        placeholder: 'Title',
                        name: 'message',
                        id: 'message',
                        value: values.message,
                        onChange: formProps.handleChange,
                        onBlur: formProps.handleBlur,
                        autoFocus: true,
                      }}
                      errorMessage={touched.message && errors.message}
                    />
                  ) : (
                    <Heading
                      headingProps={{
                        as: 'h5',
                        className: cx(
                          classes.activityHeading,
                          this.getIcon(feedType).color
                        ),
                      }}
                      colorVariant={HeadingColor.CYAN}
                      type={HeadingType.BOLD_500}>
                      {feedDate} - {feedTitle}
                    </Heading>
                  )}
                </div>
                {userAccessProgram.write && (
                  <div
                    className={cx(
                      classes.actions,
                      classes.feedIcon,
                      classes.flex1
                    )}>
                    {isEditMode && (
                      <Icon
                        name="ban"
                        className={cx(
                          classes.item,
                          classes.feedIcon,
                          classes.banIcon
                        )}
                        onClick={() => {
                          this.toggleEditMode('');
                        }}
                      />
                    )}
                    {isEditMode ? (
                      <Icon
                        name="save outline"
                        className={cx(
                          classes.item,
                          classes.feedIcon,
                          classes.saveIcon,
                          feedTitle === values.message ? classes.disabled : ''
                        )}
                        onClick={formProps.handleSubmit}
                      />
                    ) : (
                      <Icon
                        name="pencil alternate"
                        className={cx(classes.item, classes.feedIcon)}
                        onClick={() => {
                          this.toggleEditMode(feedId);
                        }}
                      />
                    )}
                    <Icon
                      name="trash alternate"
                      className={cx(classes.item)}
                      onClick={() => {
                        confirmModal.open({
                          message: `Do you want to delete ${feedTitle}?`,
                          onOkClick: () => {
                            onDelete(feedId, () => {
                              this.toggleEditMode('');
                            });
                          },
                        });
                      }}
                    />
                  </div>
                )}
              </div>
            );
          }}
        </Formik>
      </div>
    );
  }
}

export default themr<Props>('FeedRow', styles)(FeedRow);
