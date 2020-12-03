import { toast, ToastContent, ToastOptions, TypeOptions } from 'react-toastify';

class Toast {
  show(type: TypeOptions, content: ToastContent, options?: ToastOptions) {
    return toast(content, {
      type,
      ...(options || {}),
    });
  }

  success(content: ToastContent, options?: ToastOptions) {
    return this.show('success', content, options);
  }

  error(content: ToastContent, options?: ToastOptions) {
    return this.show('error', content, options);
  }

  warn(content: ToastContent, options?: ToastOptions) {
    return this.show('warning', content, options);
  }

  info(content: ToastContent, options?: ToastOptions) {
    return this.show('info', content, options);
  }

  dismiss() {
    return toast.dismiss();
  }
}

export default new Toast();
