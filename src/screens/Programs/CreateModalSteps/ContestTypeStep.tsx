import * as React from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import themr from 'src/helpers/themr';
import DescriptionBlock from 'src/components/DescriptionBlock';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import GroupVSGroup from 'src/assets/icons/group_vs_group.svg';
import GroupVSGroupActive from 'src/assets/icons/group_vs_group_active.svg';
import ReaderVSReader from 'src/assets/icons/reader_vs_reader.svg';
import ReaderVSReaderActive from 'src/assets/icons/reader_vs_reader_active.svg';
import styles from './styles.scss';

type Props = IComponentProps & {
  jumpToNextStep?: Function; // coming from WizardStep component
  jumpToPreviousStep?: Function; // coming from WizardStep component
  onChangeContestType?: (value?: ContestType) => any;
  initialValue?: ContestType;
};

export enum ContestType {
  GROUP,
  READER,
}

class ContestTypeStep extends React.Component<Props> {
  static defaultProps = {
    onChangeContestType: () => {},
  };

  state = {
    type: -1,
  };

  componentDidMount() {
    this.setState({
      type: this.props.initialValue,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.initialValue !== prevProps.initialValue) {
      this.setState({
        type: this.props.initialValue,
      });
    }
  }

  onNextPress = () => {
    const { jumpToNextStep } = this.props;
    jumpToNextStep();
  };

  onBackPress = () => {
    const { jumpToPreviousStep } = this.props;
    jumpToPreviousStep();
  };

  renderSection() {
    const { type } = this.state;
    const { onChangeContestType } = this.props;
    return (
      <>
        <Grid doubling columns="2">
          <Grid.Row>
            <Grid.Column>
              <DescriptionBlock
                icon={<GroupVSGroup height={60} />}
                iconActive={<GroupVSGroupActive height={60} />}
                title="Group vs. Group"
                description="This allows all Groups in your Program to compete against each other. Great for contests where Schools, Libraries or other Orgs are competing for a common prize."
                isSelected={type === ContestType.GROUP}
                onClick={() => {
                  this.setState({
                    type: ContestType.GROUP,
                  });
                  onChangeContestType(ContestType.GROUP);
                }}
              />
            </Grid.Column>
            <Grid.Column>
              <DescriptionBlock
                icon={<ReaderVSReader height={60} />}
                iconActive={<ReaderVSReaderActive height={60} />}
                title="Reader vs. Reader"
                description="This allows all the Readers within each Group to compete directly against each other. A good option for internal competitions among classes, grade levels, etc"
                isSelected={type === ContestType.READER}
                onClick={() => {
                  this.setState({
                    type: ContestType.READER,
                  });
                  onChangeContestType(ContestType.READER);
                }}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }

  renderButtons() {
    const { classes } = this.props;
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
                  disabled: this.state.type === -1,
                }}>
                Next
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

export default themr<Props>('ContestTypeStep', styles)(ContestTypeStep);
