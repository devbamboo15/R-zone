import BadgePreviewModal, { IState } from './view';

class PreviewModal {
  ref: any;

  open(options: IState) {
    this.ref.open(options);
  }

  close() {
    this.ref.close();
  }

  setRef = ref => {
    this.ref = ref;
  };
}

const previewModal = new PreviewModal();
export { previewModal };

export default BadgePreviewModal;
