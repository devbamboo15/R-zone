import * as React from 'react';
import { Grid, Form, Statistic } from 'semantic-ui-react';
import cn from 'classnames';
import { countBy } from 'lodash';
import { formatNumber } from 'src/helpers/number';
import Title, { TitleProps } from 'src/components/Title';
import Input, { BaseInputProps } from 'src/components/FormFields/Input';
import Select from 'src/components/FormFields/Select';
import Heading, { HeadingType } from 'src/components/Heading';
import { IOrganizetionProgress } from 'src/store/types/organizer/organizations';
import ProgramCode from 'src/components/ProgramCode';

export type TopHeaderProps = IComponentProps & {
  handleSearch?: Function;
  getOrganizationProgress?: Function;
  titleProps: TitleProps;
  searchInputProps?: BaseInputProps;
  title: string;
  onFilterProgress?: Function;
  organizationProgress?: IOrganizetionProgress;
  loading?: boolean;
  programId?: string;
  groupId?: string;
  programCode?: string;
};

interface TopHeaderStates {
  organizationProgress: IOrganizetionProgress;
}

class TopHeader extends React.Component<TopHeaderProps, TopHeaderStates> {
  state = {
    organizationProgress: {
      books: 0,
      chapters: 0,
      minutes: 0,
      pages: 0,
      yes: 0,
    },
  };

  handleFilterProgress = value => {
    const { programId, groupId } = this.props;
    const filterDataRequest = {
      interval:
        value && value.toString() !== 'all' ? `last_${value}_days` : 'overall',
    };
    this.props.getOrganizationProgress(programId, groupId, filterDataRequest);
  };

  render() {
    const {
      classes,
      titleProps,
      title,
      searchInputProps,
      organizationProgress = {} as IOrganizetionProgress,
      programCode,
    } = this.props;
    const stats = [
      {
        name: 'Books',
        value: organizationProgress.books,
        style: 'books',
      },
      {
        name: 'Chapters',
        value: organizationProgress.chapters,
        style: 'chapters',
      },
      {
        name: 'Minutes',
        value: organizationProgress.minutes,
        style: 'minutes',
      },
      {
        name: 'Pages',
        value: organizationProgress.pages,
        style: 'books',
      },
      {
        name: '"Yes" Entries',
        value: organizationProgress.yes,
        style: 'entries',
      },
    ];
    const options = [
      {
        text: 'Last 7 days',
        value: '7',
      },
      {
        text: 'Last 30 days',
        value: '30',
      },
      {
        text: 'All Time',
        value: 'all',
      },
    ];

    const countItem = countBy(stats, item => typeof item.value !== 'undefined');
    return (
      <Grid columns={3}>
        <Grid.Column width={6}>
          <Title {...titleProps}>{title}</Title>
          <Form>
            <Input {...searchInputProps} />
          </Form>
        </Grid.Column>
        {programCode && (
          <Grid.Column verticalAlign="top" className={classes.topProgramCode}>
            <ProgramCode label="Program Code" code={programCode} copyable />
          </Grid.Column>
        )}
        <Grid.Column
          className={cn(classes.statsContainer, {
            [classes.moreItem]: countItem.true < 3,
          })}>
          <div className={classes.stats}>
            <div className={classes.mainStats}>
              <Select
                selectProps={{
                  options,
                  name: 'organization_type',
                  className: classes.select,
                  defaultValue: 'all',
                  onChange: (_, { value }) => {
                    this.handleFilterProgress(value);
                  },
                }}
              />
              {stats.map(stat => {
                if (typeof stat.value === 'undefined') {
                  return null;
                }

                return (
                  <div key={stat.name} className={classes.metricItem}>
                    <Statistic size="tiny">
                      <Statistic.Value className={classes[stat.style]}>
                        {formatNumber(stat.value)}
                      </Statistic.Value>
                      <Heading
                        headingProps={{ as: 'h5', textAlign: 'center' }}
                        type={HeadingType.NORMAL}>
                        {stat.name}
                      </Heading>
                    </Statistic>
                  </div>
                );
              })}
            </div>
          </div>
        </Grid.Column>
      </Grid>
    );
  }
}

export default TopHeader;
