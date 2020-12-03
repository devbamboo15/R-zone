import * as React from 'react';
import cx from 'classnames';
import { Grid, Icon } from 'semantic-ui-react';
import themr from 'src/helpers/themr';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import MetricMinute from 'src/assets/icons/metric_minute.svg';
import MetricMinuteActive from 'src/assets/icons/metric_minute_active.svg';
import MetricBook from 'src/assets/icons/metric_book.svg';
import MetricBookActive from 'src/assets/icons/metric_book_active.svg';
import MetricChapter from 'src/assets/icons/metric_chapter.svg';
import MetricChapterActive from 'src/assets/icons/metric_chapter_active.svg';
import MetricYesNo from 'src/assets/icons/metric_yes_no.svg';
import MetricYesNoActive from 'src/assets/icons/metric_yes_no_active.svg';
import MetricPage from 'src/assets/icons/metric_page.svg';
import MetricPageActive from 'src/assets/icons/metric_page_active.svg';
import Heading, { HeadingType } from 'src/components/Heading';
import MessageBox from 'src/components/MessageBox';
import { Metric } from 'src/store/types';
import styles from './styles.scss';

type Props = IComponentProps & {
  jumpToNextStep?: Function; // coming from WizardStep component
  jumpToPreviousStep?: Function; // coming from WizardStep component
  message?: string | React.ReactElement;
  initialMetric?: Metric | number;
  onNext: (value: Metric | number) => any;
};

class GroupMetricStep extends React.Component<Props> {
  state = {
    type: -1,
  };

  componentDidMount() {
    this.setState({
      type: this.props.initialMetric,
    });
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.initialMetric !== prevProps.initialMetric) {
      this.setState({
        type: this.props.initialMetric,
      });
    }
  }

  onNextPress = () => {
    const { jumpToNextStep, onNext } = this.props;
    if (onNext) {
      onNext(this.state.type);
    }
    jumpToNextStep();
  };

  onBackPress = () => {
    const { jumpToPreviousStep } = this.props;
    jumpToPreviousStep();
  };

  renderMetric(type, name, MetricIcon, MetricIconActive) {
    const { classes } = this.props;
    const { type: selectedType } = this.state;
    return (
      <div
        className={cx(classes.metricWrapper, {
          [classes.metricSelected]: selectedType === type,
        })}
        onClick={() => {
          this.setState({
            type,
          });
        }}>
        <div className={classes.metricName}>{name}</div>
        {selectedType === type ? (
          <MetricIconActive height={30} />
        ) : (
          <MetricIcon height={30} />
        )}
      </div>
    );
  }

  renderSection() {
    const { classes, message } = this.props;
    return (
      <>
        <Grid doubling columns="5" className={classes.metrics}>
          <Grid.Row>
            <Grid.Column>
              {this.renderMetric(
                Metric.minutes,
                'Minutes',
                MetricMinute,
                MetricMinuteActive
              )}
            </Grid.Column>
            <Grid.Column>
              {this.renderMetric(
                Metric.pages,
                'Pages',
                MetricPage,
                MetricPageActive
              )}
            </Grid.Column>
            <Grid.Column>
              {this.renderMetric(
                Metric.chapters,
                'Chapters',
                MetricChapter,
                MetricChapterActive
              )}
            </Grid.Column>
            <Grid.Column>
              {this.renderMetric(
                Metric.books,
                'Books',
                MetricBook,
                MetricBookActive
              )}
            </Grid.Column>
            <Grid.Column>
              {this.renderMetric(
                Metric['yes/no'],
                'Yes/No',
                MetricYesNo,
                MetricYesNoActive
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <MessageBox
          description={
            message ||
            'Create a goal that is challenging but attainable for your reading group. Reading goals can be changed or deleted anytime.'
          }
        />
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
        <Heading headingProps={{ as: 'h4' }} type={HeadingType.NORMAL}>
          Measure Reading By:
        </Heading>
        {this.renderSection()}
        {this.renderButtons()}
      </div>
    );
  }
}

export default themr<Props>('GroupMetricStep', styles)(GroupMetricStep);
