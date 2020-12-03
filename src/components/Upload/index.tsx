import { compose, withState, withPropsOnChange } from 'recompose';
import Upload, { UploadProps, ComponentsProps } from './Upload';

export default compose<UploadProps, ComponentsProps>(
  withState('currentFiles', 'setCurrentFiles', null),
  withPropsOnChange(['loading'], ({ loading, setCurrentFiles }) => {
    if (!loading) setCurrentFiles(null);
  })
)(Upload);
