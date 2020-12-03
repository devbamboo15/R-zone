import * as React from 'react';
import Modal from 'src/components/Modal';
import MedalSvg from 'src/assets/icons/medal2.svg';
import AwardBigSvg from 'src/assets/icons/award_big.svg';
import Title from 'src/components/Title';
import { IAwardsPreviewItem } from 'src/store/types/organizer/awards';
import get from 'lodash/get';
import Spinner from 'src/components/Spinner';

export type Props = IScreenProps & {
  onClose?: any;
  data?: IAwardsPreviewItem;
  loading?: boolean;
};

class AwardsPreviewModal extends React.Component<Props> {
  render() {
    const { classes, onClose, data, loading } = this.props;
    const title = get(data, 'attributes.title') || '';
    const description = get(data, 'attributes.description') || '';
    const avatarUrl = get(data, 'attributes.avatar_url') || '';
    return (
      <Modal
        modelProps={{
          open: true,
          closeIcon: true,
          size: 'mini',
          onClose,
          className: classes.awardModal,
        }}>
        <Title icon={<MedalSvg height={25} />}>Award Preview</Title>
        <div>
          <div className={classes.awardImage}>
            {avatarUrl ? (
              <div>
                <img
                  src={avatarUrl}
                  alt="avatar"
                  style={{ height: '80px', margin: '0 auto', display: 'block' }}
                />
              </div>
            ) : (
              <AwardBigSvg height={150} width="100%" />
            )}
          </div>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <div className={classes.title}>{title}</div>
              {/* <div className={classes.desc1}>Good job! </div> */}
              <div className={classes.desc2}>{description}</div>
            </>
          )}
        </div>
      </Modal>
    );
  }
}

export default AwardsPreviewModal;
