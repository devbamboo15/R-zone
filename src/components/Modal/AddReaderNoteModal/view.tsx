import * as React from 'react';
import Modal, { BaseModalProps } from 'src/components/Modal';
import DeleteSvg from 'src/assets/icons/delete2.svg';
import { Grid, List } from 'semantic-ui-react';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import Heading, { HeadingType } from 'src/components/Heading';
import TextArea from 'src/components/FormFields/TextArea';
import { INoteData } from 'src/store/types/common';
import Spinner from 'src/components/Spinner';
import { map } from 'lodash';
import idx from 'idx';
import * as moment from 'moment';
import { confirmModal } from 'src/components/Modal/ConfirmationModal';
import filter from 'lodash/filter';

export type AddReaderNoteModalProps = IComponentProps & {
  setNoteText?: Function;
  onSave?: Function;
  onDeleteAllNotes?: Function;
  addReaderNoteLoading?: boolean;
  deleteAllReaderNoteLoading?: boolean;
  noteText?: string | null;
};
export type AddReaderNoteModalOutProps = BaseModalProps & {
  userId?: string;
  onCancel?: Function;
  onListReadersRefresh?: Function;
  notes?: INoteData[];
  loading?: boolean;
  getReaderDetail?: Function;
  autoLoadNote?: boolean;
  readerDetailLoading?: boolean;
  notesFromAction?: any;
  readerName?: string;
};
class AddNoteReaderModal extends React.Component<
  AddReaderNoteModalProps & AddReaderNoteModalOutProps
> {
  render() {
    const {
      modelProps,
      classes,
      onCancel,
      onSave,
      onDeleteAllNotes,
      addReaderNoteLoading,
      notes,
      noteText,
      setNoteText,
      deleteAllReaderNoteLoading,
      loading,
      notesFromAction,
      autoLoadNote,
      readerDetailLoading,
      readerName,
    } = this.props;
    const included = idx(notesFromAction, x => x.included) || [];
    let notesFromActionData = filter(included, { type: 'note' }) || [];
    notesFromActionData = notesFromActionData.map(n => n.attributes);
    const notesData = autoLoadNote ? notesFromActionData : notes;
    return (
      <Modal modelProps={{ ...modelProps }}>
        <div>
          <div className={classes.modalTop}>
            <div style={{ marginTop: 10, textAlign: 'center' }}>
              <Heading headingProps={{ as: 'h3' }} type={HeadingType.BOLD_600}>
                Add Note
              </Heading>
              <h4 style={{ margin: '0' }}>
                <span style={{ fontWeight: 'normal' }}>Reader name:</span>
                {` ${readerName || ''}`}
              </h4>
              <p>
                Notes are visible to Reading Program Organizers only. Readers
                cannot see notes.
              </p>
            </div>
          </div>
          <Grid>
            <div className={classes.notesContainer}>
              <List className={classes.notesList}>
                {(loading || readerDetailLoading) && <Spinner />}
                {map(notesData, (note: INoteData, index: string | number) => (
                  <List.Item key={index}>
                    <List.Header className={classes.noteTime}>
                      {moment(idx(note, x => x.created_at)).format(
                        'MM/DD/YYYY hh:ss a'
                      )}{' '}
                      {`${idx(note, x => x.created_by_user.first_name)} ${idx(
                        note,
                        x => x.created_by_user.last_name
                      )}`}
                      :
                    </List.Header>
                    <p className={classes.noteText}>
                      {idx(note, x => x.note_text)}
                    </p>
                  </List.Item>
                ))}
              </List>
            </div>
          </Grid>
          <Grid>
            <TextArea
              textAreaProps={{
                placeholder: 'Write your text here',
                className: classes.textArea,
                value: noteText,
                onChange: (_, e) => {
                  setNoteText(e.value);
                },
              }}
            />
          </Grid>
          <Grid>
            <Grid.Row textAlign="center" verticalAlign="middle">
              <div className={classes.bottomButtonsContainer}>
                <Button
                  buttonType={ButtonType.TRANSPARENT}
                  buttonProps={{
                    disabled: !notesData || notesData.length <= 0,
                    type: 'button',
                    onClick: () => {
                      confirmModal.open({
                        message: 'Are you sure you want to delete all notes?',
                        onOkClick: () => {
                          onDeleteAllNotes();
                        },
                      });
                    },
                  }}>
                  <span className={classes.deleteAllText}>
                    <DeleteSvg height={19} />
                    Delete All Notes
                  </span>
                </Button>
                <div className={classes.bottomButtons}>
                  <Button
                    colorVariant={ButtonColor.GRAY}
                    buttonType={ButtonType.ROUND}
                    buttonProps={{ type: 'button', onClick: () => onCancel() }}>
                    Cancel
                  </Button>
                  <Button
                    colorVariant={ButtonColor.PRIMARY}
                    buttonType={ButtonType.ROUND}
                    buttonProps={{
                      type: 'button',
                      loading: addReaderNoteLoading,
                      disabled: !noteText,
                      onClick: () => onSave(),
                    }}>
                    Save
                  </Button>
                </div>
              </div>
            </Grid.Row>
          </Grid>
        </div>
        {deleteAllReaderNoteLoading && (
          <div className={classes.loadingContainer}>
            <Spinner />
          </div>
        )}
      </Modal>
    );
  }
}
export default AddNoteReaderModal;
