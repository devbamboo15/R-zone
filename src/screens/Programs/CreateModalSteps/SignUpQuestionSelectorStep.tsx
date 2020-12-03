import * as React from 'react';
import ReactSelect, { components } from 'react-select';
import { Grid, Icon } from 'semantic-ui-react';
import themr from 'src/helpers/themr';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import MessageBox from 'src/components/MessageBox';
import Heading, { HeadingType } from 'src/components/Heading';
import { ISignUpQuestion } from 'src/store/types/organizer/questions';
import styles from './styles.scss';

type Props = IComponentProps & {
  jumpToNextStep?: Function; // coming from WizardStep component
  jumpToPreviousStep?: Function; // coming from WizardStep component
  onNext?: Function;
  questionList: ISignUpQuestion[];
  initialData?: ISignUpQuestion[];
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

class SignUpQuestionSelectorStep extends React.Component<Props> {
  state = {
    questions: [],
  };

  componentDidMount() {
    const { initialData } = this.props;
    this.setState({
      questions: initialData,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.initialData !== prevProps.initialData) {
      const { initialData } = this.props;
      this.setState({
        questions: initialData,
      });
    }
  }

  onNextPress = () => {
    const { jumpToNextStep, onNext } = this.props;
    const { questions } = this.state;
    if (onNext) {
      onNext(questions);
    }
    jumpToNextStep();
  };

  onBackPress = () => {
    const { jumpToPreviousStep } = this.props;
    jumpToPreviousStep();
  };

  handleChange = questions => {
    this.setState({ questions });
  };

  renderSection() {
    const { classes, questionList } = this.props;
    const { questions } = this.state;

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
      value: x.id,
    }));

    return (
      <>
        <Heading headingProps={{ as: 'h4' }} type={HeadingType.BOLD_500}>
          <span className={classes.signUpSubText}>
            Select question(s) you'd like to ask readers as they join this
            reading group. The questions will not be required as a condition of
            joining the group.
          </span>
        </Heading>
        <label className={classes.dropdownLabel}>Goal Questions:</label>
        <Grid doubling className={classes.metrics}>
          <Grid.Row verticalAlign="bottom">
            <Grid.Column width={10}>
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
                      return this.handleChange(result);
                    }
                  }

                  return this.handleChange(selected);
                }}
                value={selOptions}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <MessageBox
          description={
            <div>
              Select the first and last dates you want to collect reading data.
              The dates can be adjusted anytime. There is no limit to how long a
              program can run.
            </div>
          }
        />
      </>
    );
  }

  renderButtons() {
    const { classes } = this.props;
    const { questions } = this.state;
    const skip = questions.length < 1;
    return (
      <>
        <Grid className={classes.buttonWrapper}>
          <Grid.Row columns="equal">
            <Grid.Column>
              <Button
                colorVariant={ButtonColor.MAIN}
                buttonType={ButtonType.ROUND}
                icon={<Icon name="arrow left" />}
                classes={{ button: classes.cancelButton }}
                buttonProps={{
                  onClick: this.onBackPress,
                }}>
                {'Back'}
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Button
                colorVariant={ButtonColor.SECONDARY}
                buttonType={ButtonType.ROUND}
                icon={<Icon name="arrow right" />}
                buttonProps={{
                  onClick: this.onNextPress,
                }}>
                {skip ? 'Skip' : 'Next'}
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.step}>
        {this.renderSection()}
        {this.renderButtons()}
      </div>
    );
  }
}

export default themr<Props>('SignUpQuestionSelectorStep', styles)(
  SignUpQuestionSelectorStep
);
