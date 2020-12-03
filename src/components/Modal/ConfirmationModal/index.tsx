import ConfirmationModal, { IState } from './view';

class ConfirmModal {
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

const confirmModal = new ConfirmModal();
export { confirmModal };

export default ConfirmationModal;
