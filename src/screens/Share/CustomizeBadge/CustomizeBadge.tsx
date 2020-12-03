import * as React from 'react';
import CustomizeBadeForm, {
  CustomizeBadgeForm,
} from 'src/components/Forms/CustomizeBadgeForm';
import { Formik } from 'formik';
import Heading, { HeadingType, HeadingColor } from 'src/components/Heading';
import ShareFooter, {
  ShareFooterType,
} from 'src/screens/Share/ShareFooter/ShareFooter';
import * as Yup from 'yup';
import * as H from 'history';
import URL from 'src/helpers/urls';
import BadgePreviewModal, {
  previewModal,
} from 'src/components/Modal/BadgePreviewModal';
import get from 'lodash/get';
import toast from 'src/helpers/Toast';

export interface ComponentProps {
  onFormSubmit?: (values: CustomizeBadgeForm) => void;
  updateShare: Function;
  share?: any;
  programs?: any;
  history: H.History;
}

export type CustomizeBadgeProps = IComponentProps & ComponentProps;

let initialValues = {
  title: '',
  greeting: '',
  post: '',
  program: '',
  program_name: '',
};

class CustomizeBadge extends React.Component<CustomizeBadgeProps, {}> {
  componentDidUpdate = prevProps => {
    const { share, history } = this.props;
    if (
      share.loading === false &&
      share.success === true &&
      share.loading !== prevProps.share.loading
    ) {
      history.push(URL.SHARE_TAB({ tab: 'facebook' }));
    }
  };

  goBack = () => {
    const { history } = this.props;
    history.push(URL.SHARE_TAB({ tab: 'facebook' }));
  };

  onFormSubmit = form => {
    const post = {
      title_text: form.title,
      greeting_text: form.greeting,
      post_text: form.post,
      program_id: form.program,
    };

    this.props.updateShare(post);
  };

  onPreview = (form, programs) => {
    if (!form.program) {
      toast.error('Please select a program');
      return false;
    }

    const share = {
      data: [
        {
          attributes: {
            title_text: form.title,
            greeting_text: form.greeting,
            post_text: form.post,
            program_id: form.program * 1,
          },
        },
      ],
    };

    const program = programs.find(item => item.id === form.program);

    previewModal.open({
      share,
      program,
    });
    return true;
  };

  render() {
    const { classes, programs, share } = this.props;
    const userShare = get(share, 'data[0]attributes');

    let program = null;
    if (userShare) {
      initialValues.greeting = userShare.greeting_text;
      initialValues.post = userShare.post_text;

      program = programs.find(item => item.id * 1 === userShare.program_id);

      if (program) {
        initialValues.program = program.id;
        initialValues.program_name = program.attributes.name;
      }
    }

    if (!program) {
      initialValues = {
        title: '',
        greeting: '',
        post: '',
        program: '',
        program_name: '',
      };
    }

    return (
      <div className={classes.customizeBadge}>
        <div className={classes.title}>
          <Heading
            headingProps={{ as: 'h3' }}
            colorVariant={HeadingColor.BLACK}
            type={HeadingType.BOLD_600}>
            Customize Badges
          </Heading>
        </div>
        <Formik
          initialValues={{ ...initialValues }}
          onSubmit={this.onFormSubmit}
          enableReinitialize
          validationSchema={Yup.object().shape({
            // title: Yup.string().required('Title is Required'),
            greeting: Yup.string().required('Greeting is Required'),
            post: Yup.string().required('Post is Required'),
            program: Yup.string().required('Program is Required'),
          })}>
          {({
            values,
            errors,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
          }) => (
            <>
              <CustomizeBadeForm
                values={values}
                errors={errors}
                handleBlur={handleBlur}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
              />
              <ShareFooter
                shareType={ShareFooterType.SUBMIT_FORM}
                onCustomizeBadgeFormSubmit={handleSubmit}
                onCustomizeBadgeFormReset={this.goBack}
                onPreview={() => this.onPreview(values, programs)}
              />
              <BadgePreviewModal
                ref={previewModal.setRef}
                customContent={values.post}
              />
            </>
          )}
        </Formik>
      </div>
    );
  }
}

export default CustomizeBadge;
