import * as React from 'react';
import Modal from 'src/components/Modal';
import MedalSvg from 'src/assets/icons/medal2.svg';
import Title from 'src/components/Title';
import { Grid } from 'semantic-ui-react';
import { IProgramAwardsState } from 'src/store/reducers/organizer/awards';
import Spinner from 'src/components/Spinner';
// import ReSelect from 'src/components/ReSelect';
import get from 'lodash/get';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import Select from 'src/components/FormFields/Select';
import { MetricText } from 'src/store/types';
import AwardRow from './AwardRow';
import AwardsPreview from '../AwardsPreview';

interface IParams {
  programId: string;
  groupId?: string;
}
interface IMatch {
  params: IParams;
}

export type Props = IScreenProps & {
  match?: IMatch;
  awardsState?: IProgramAwardsState;
  updateAwards?: any;
  updateAwardsState?: any;
  awardsPreviewState?: any;
  getAwardsPreview?: any;
  restoreDefaultAwards?: any;
  groups: any[];
  userAccessProgram: any;
  getGroupAwards: Function;
  getProgramAwards: Function;
  updateAwardsAvatar: Function;
  deleteAwardsAvatar: Function;
  deleteAwardAvatarLoading: boolean;
  updateAwardAvatarLoading: boolean;
  updateAwardAvatarSuccess: boolean;
  restoreDefaultAwardLoading: boolean;
};

class AwardsModal extends React.Component<Props> {
  state = {
    currentlyEditingRow: null,
    isOpenPreviewModal: false,
  };

  handleOpenPreview = (awardsId): void => {
    this.props.getAwardsPreview(awardsId);
    this.setState({
      isOpenPreviewModal: true,
    });
  };

  handleClosePreview = (): void => {
    this.setState({
      isOpenPreviewModal: false,
    });
  };

  handleRestoreDefaultAwards = (awardsId): void => {
    this.props.restoreDefaultAwards(awardsId);
  };

  isDuplicateQuantity = (id, particularQuantitySlug) => {
    const { awardsState } = this.props;
    const listOtherAward = (awardsState.data || []).filter(a => a.id !== id);
    const foundAwardIndex = findIndex(listOtherAward, {
      slug: particularQuantitySlug,
    });
    return foundAwardIndex >= 0;
  };

  render() {
    const {
      classes,
      history,
      awardsState,
      updateAwardsState,
      awardsPreviewState,
      match,
      location,
      groups,
      deleteAwardAvatarLoading,
      updateAwardAvatarLoading,
      updateAwardAvatarSuccess,
      restoreDefaultAwardLoading,
      userAccessProgram,
    } = this.props;
    const programId = get(match, 'params.programId') || '';
    const groupId = get(match, 'params.groupId') || '';
    const { currentlyEditingRow, isOpenPreviewModal } = this.state;
    const loadingPreview = !(
      awardsPreviewState.status === 'success' ||
      awardsPreviewState.status === 'error'
    );
    const groupOptions = groups.map((item: any) => {
      const text = get(item, 'attributes.name');
      const value = get(item, 'id') || '';
      return {
        value,
        text,
      };
    });
    const foundGroup = find(groups, { id: groupId.toString() }) || {};
    const groupName = get(foundGroup, 'attributes.name', '');
    const groupMetric =
      MetricText[get(foundGroup, 'attributes.active_metric_id', '')] || '';
    return (
      <Modal
        modelProps={{
          open: true,
          closeIcon: true,
          size: 'large',
          onClose: () => {
            history.goBack();
          },
        }}>
        <Grid columns="16">
          <Grid.Column width={16} className={classes.awardHeading}>
            <Title icon={<MedalSvg height={25} />}>Awards</Title>
            <div className={classes.groupInfo}>
              {groupName} Metric: {groupMetric}
            </div>
          </Grid.Column>
          {!groupId && (
            <Grid.Column width={6}>
              <div style={{ marginTop: '1rem' }}>
                <Select
                  selectProps={{
                    options: groupOptions,
                    name: 'group_ids',
                    className: classes.select,
                    defaultValue: groupOptions[0] ? groupOptions[0].value : '',
                    onChange: (_, { value }) => {
                      const groupIds = [value];
                      if (groupIds && groupIds.length > 0) {
                        this.props.getGroupAwards(programId, groupIds);
                      } else {
                        this.props.getProgramAwards(programId);
                      }
                    },
                  }}
                />
                {/* <ReSelect
                  selectProps={{
                    options: groupOptions,
                    onChange: value => {
                      const groupIds = [value.value]
                      if (groupIds && groupIds.length > 0) {
                        this.props.getGroupAwards(programId, groupIds);
                      } else {
                        this.props.getProgramAwards(programId);
                      }
                    },
                    placeholder: 'All',
                  }}
                /> */}
              </div>
            </Grid.Column>
          )}
        </Grid>
        <Grid columns="4" className={classes.tableHeader}>
          <Grid.Column className={classes.tableHeaderColumn} width={2}>
            Image
          </Grid.Column>
          <Grid.Column className={classes.tableHeaderColumn} width={4}>
            Award Level
          </Grid.Column>
          <Grid.Column className={classes.tableHeaderColumn} width={5}>
            Description
          </Grid.Column>
          <Grid.Column className={classes.tableHeaderColumn} width={2}>
            Visibility
          </Grid.Column>
          <Grid.Column className={classes.tableHeaderColumn} width={3}>
            Actions
          </Grid.Column>
        </Grid>
        {(awardsState.loading ||
          updateAwardAvatarLoading ||
          updateAwardsState.loading ||
          restoreDefaultAwardLoading) && <Spinner />}
        <div>
          {awardsState &&
            awardsState.data.map((row, ind) => {
              return (
                <AwardRow
                  data={row}
                  key={ind}
                  onEditRow={index => {
                    this.setState({
                      currentlyEditingRow: index,
                    });
                  }}
                  onSubmitEditRow={(id, data, cb) => {
                    this.props.updateAwards(id, data, () => {
                      if (groupId) {
                        this.props.getGroupAwards(programId, [groupId]);
                      }
                      if (cb) cb();
                    });
                  }}
                  onUpdateAvatar={this.props.updateAwardsAvatar}
                  onDeleteAvatar={this.props.deleteAwardsAvatar}
                  editRowStatus={updateAwardsState.status}
                  lessOpacity={
                    currentlyEditingRow ? currentlyEditingRow !== row.id : false
                  }
                  onPreviewClick={() => {
                    this.handleOpenPreview(row.id);
                  }}
                  onSubmitRestore={() => {
                    this.handleRestoreDefaultAwards(row.id);
                  }}
                  avatarLoading={deleteAwardAvatarLoading}
                  programId={programId}
                  groupId={groupId}
                  updateAwardAvatarSuccess={updateAwardAvatarSuccess}
                  userAccessProgram={userAccessProgram}
                  isDuplicateQuantity={this.isDuplicateQuantity}
                />
              );
            })}
        </div>
        {isOpenPreviewModal && (
          <AwardsPreview
            onClose={this.handleClosePreview}
            history={history}
            location={location}
            match={match}
            data={awardsPreviewState.data}
            loading={loadingPreview}
          />
        )}
      </Modal>
    );
  }
}

export default AwardsModal;
