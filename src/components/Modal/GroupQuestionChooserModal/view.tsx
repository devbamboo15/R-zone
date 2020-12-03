import * as React from 'react';
import Modal from 'src/components/Modal';
import Heading, { HeadingColor, HeadingType } from 'src/components/Heading';
import ReactSelect, { components } from 'react-select';
import { ModalProps, Grid, Icon } from 'semantic-ui-react';
import BookPlus from 'src/assets/icons/book_plus.svg';
import Button, { ButtonType, ButtonColor } from 'src/components/Button';
import MessageBox from 'src/components/MessageBox';
import { ISignUpQuestion } from 'src/store/types/organizer/questions';

export type Props = IComponentProps & {
  modelProps?: ModalProps;
  questions?: ISignUpQuestion[];
  loading?: boolean;
  itemLoading?: string;
  accessGroupByProgram?: any;
  onSave: Function;
  onUpdateQuestions: Function;
  questionList: ISignUpQuestion[];
};

const Option = props => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{' '}
        <label>{props.data.attributes.question}</label>
      </components.Option>
    </div>
  );
};

const ValueContainer = ({ children, ...props }) => {
  const { getValue } = props;
  const nbValues = getValue().length;

  return (
    <components.ValueContainer {...props}>
      {nbValues > 0
        ? `${nbValues} Question${nbValues > 1 ? 's' : ''} Selected`
        : 'Select Question(s)'}
      {React.cloneElement(children[1])}
    </components.ValueContainer>
  );
};

class GroupQuestionChooserModal extends React.Component<Props> {
  static defaultProps = {
    modelProps: {},
  };

  render() {
    const {
      modelProps,
      classes,
      onSave,
      onUpdateQuestions,
      questions,
      questionList,
    } = this.props;

    const options = questionList
      .map(x => ({
        ...x,
        value: x.id,
      }))
      .sort((a: ISignUpQuestion, b: ISignUpQuestion) => {
        return (
          parseInt(a.attributes.sort_order, 10) -
          parseInt(b.attributes.sort_order, 10)
        );
      });
    const selOptions = questions.map(x => ({
      ...x,
      value: x.id.toString(),
    }));

    return (
      <Modal modelProps={modelProps} header={null}>
        <div className={classes.headerTitle}>
          <BookPlus height={80} className={classes.headerIcon} />
          <Heading headingProps={{ as: 'h2' }} type={HeadingType.BOLD_600}>
            Additional Sign Up Questions
          </Heading>
          <div>
            <span className={classes.subtitleText}>(optional)</span>
          </div>
        </div>
        <Heading headingProps={{ as: 'h4' }} type={HeadingType.BOLD_500}>
          <span className={classes.message}>
            Select question(s) you'd like to ask readers as they join this
            reading group. The questions will not be required as a condition of
            joining the group.
          </span>
        </Heading>
        <label className={classes.dropdownLabel}>Goal Questions</label>
        <Grid>
          <Grid.Column width={8}>
            <ReactSelect
              isMulti
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={{
                Option,
                ValueContainer,
                IndicatorSeparator: () => null,
              }}
              isSearchable={false}
              options={options}
              placeholder="Select Question(s)"
              onChange={(selected, event) => {
                if (selected !== null && selected.length > 0) {
                  let result = [];
                  if (selected.length === options.length) {
                    if (event.action === 'select-option') {
                      result = [...options];
                    }
                    // return this.handleChange(result);
                    return onUpdateQuestions(result);
                  }
                }

                // return this.handleChange(selected);
                return onUpdateQuestions(selected);
              }}
              value={selOptions}
            />
          </Grid.Column>
        </Grid>
        <div className={classes.separator} />
        <MessageBox
          description={
            <div>
              You can get a better idea of who and where your reader is by
              adding in a few additional questions during the sign up process.
            </div>
          }
        />
        <div className={classes.separator} />
        <div className={classes.saveButtonContainer}>
          <Button
            icon={<Icon name="save outline" />}
            buttonType={ButtonType.ROUND}
            colorVariant={ButtonColor.PRIMARY}
            buttonProps={{
              type: 'button',
              onClick: () => {
                onSave();
              },
              loading: false,
            }}>
            <Heading
              headingProps={{ as: 'h4' }}
              colorVariant={HeadingColor.WHITE}
              type={HeadingType.NORMAL}>
              Save
            </Heading>
          </Button>
        </div>
      </Modal>
    );
  }
}

export default GroupQuestionChooserModal;
