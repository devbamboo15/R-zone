import * as React from 'react';
import Modal, { BaseModalProps } from 'src/components/Modal';
import { Grid, Image } from 'semantic-ui-react';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import Heading, { HeadingType, HeadingColor } from 'src/components/Heading';
import TextArea from 'src/components/FormFields/TextArea';
import { IBookItem } from 'src/store/types';
import StarRatings from 'react-star-ratings';
import Spinner from 'src/components/Spinner';
import idx from 'idx';

export type ReviewBookModalProps = IComponentProps & {
  getBookLoading: boolean;
  reviewBookLoading: boolean;
  setReviewText: Function;
  onSave: Function;
  reviewText: string | null;
  rating: number;
  setRating: Function;
};
export type ReviewBookModalOutProps = BaseModalProps & {
  book: IBookItem;
  onCancel: Function;
  readerId?: string;
};
class ReviewBookModal extends React.Component<
  ReviewBookModalProps & ReviewBookModalOutProps
> {
  render() {
    const {
      modelProps,
      classes,
      onCancel,
      onSave,
      reviewBookLoading,
      reviewText,
      setReviewText,
      rating,
      setRating,
      book,
      getBookLoading,
    } = this.props;
    return (
      <Modal modelProps={{ ...modelProps }}>
        <div>
          <div className={classes.modalTop}>
            <div style={{ marginTop: 10 }}>
              <Heading headingProps={{ as: 'h3' }} type={HeadingType.BOLD_600}>
                Review Book
              </Heading>
            </div>
          </div>
          <Grid>
            <div className={classes.book}>
              <Image
                size="small"
                src={idx(book, x => x.volumeInfo.imageLinks.thumbnail)}
              />
              <Heading
                headingProps={{ as: 'h3' }}
                colorVariant={HeadingColor.SECONDARY}
                type={HeadingType.BOLD_600}>
                {idx(book, x => x.volumeInfo.title)}
              </Heading>
            </div>
          </Grid>
          <Grid>
            <TextArea
              textAreaProps={{
                placeholder: 'Write your text here',
                value: reviewText || '',
                className: classes.textArea,
                onChange: (_, e) => {
                  setReviewText(e.value);
                },
              }}
            />
          </Grid>
          <Grid verticalAlign="middle" textAlign="center">
            <StarRatings
              rating={rating}
              starHoverColor="#8946df"
              starRatedColor="#8946df"
              changeRating={(newRating: number) => setRating(newRating)}
              numberOfStars={5}
              name="rating"
            />
          </Grid>
          <Grid>
            <Grid.Row textAlign="center" verticalAlign="middle">
              <div className={classes.bottomButtonsContainer}>
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
                      loading: reviewBookLoading,
                      disabled: !reviewText,
                      onClick: () => onSave(),
                    }}>
                    Save
                  </Button>
                </div>
              </div>
            </Grid.Row>
          </Grid>
        </div>
        {getBookLoading && (
          <div className={classes.loadingContainer}>
            <Spinner />
          </div>
        )}
      </Modal>
    );
  }
}
export default ReviewBookModal;
