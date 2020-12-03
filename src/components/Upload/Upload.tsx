import * as React from 'react';
import { get } from 'lodash';
import { Divider } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import themr from 'src/helpers/themr';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import CloudSvg from 'src/assets/icons/cloud.svg';
import AddSvg from 'src/assets/icons/plus.svg';
import LoadingSvg from 'src/assets/icons/circles-loader.svg';
import Heading, { HeadingColor, HeadingType } from 'src/components/Heading';
import styles from './styles.scss';

export interface WithStateProps {
  currentFiles?: File | null;
  setCurrentFiles?: Function;
}
export interface ComponentsProps {
  title?: string;
  supportedDescription?: string;
  mimes?: any[];
  isMultiple?: boolean;
  onUpload?: Function;
  loading?: boolean;
}
export type UploadProps = WithStateProps & ComponentsProps;

const Upload = ({
  title,
  mimes,
  classes,
  isMultiple,
  supportedDescription,
  onUpload,
  loading,
  currentFiles,
  setCurrentFiles,
}) => {
  const onDrop = acceptedFiles => {
    onUpload(acceptedFiles);
    setCurrentFiles(acceptedFiles);
  };
  return (
    <div className={classes.container}>
      <Dropzone onDrop={onDrop} multiple={isMultiple} accept={mimes}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <div className={classes.beforeUpload}>
                <CloudSvg width={60} />
                <Heading
                  headingProps={{ as: 'h2' }}
                  type={HeadingType.NORMAL}
                  colorVariant={HeadingColor.BLACK}>
                  {title}
                </Heading>
                {!loading ? (
                  <>
                    <p className={classes.descriptionSupported}>
                      {supportedDescription}
                    </p>
                    <Divider className={classes.divider} horizontal>
                      Or
                    </Divider>
                    <Button
                      buttonProps={{
                        primary: false,
                        onClick: () => {},
                      }}
                      colorVariant={ButtonColor.PRIMARY}
                      icon={<AddSvg height={20} />}
                      buttonType={ButtonType.ROUND}>
                      <Heading
                        headingProps={{ as: 'h4' }}
                        colorVariant={HeadingColor.WHITE}
                        type={HeadingType.NORMAL}>
                        Add File
                      </Heading>
                    </Button>
                  </>
                ) : (
                  <div className={classes.uploading}>
                    <Heading
                      headingProps={{ as: 'h4' }}
                      type={HeadingType.NORMAL}
                      colorVariant={HeadingColor.SECONDARY}>
                      {(currentFiles || []).map((file: File, index: any) => (
                        <span className={classes.fileName} key={index}>
                          {get(file, 'name', '')}
                        </span>
                      ))}
                    </Heading>
                    <div className={classes.loadingButton}>
                      <Button
                        buttonProps={{
                          primary: false,
                          disabled: true,
                        }}
                        colorVariant={ButtonColor.CYAN}
                        icon={<LoadingSvg height={20} />}
                        buttonType={ButtonType.ROUND}>
                        <Heading
                          headingProps={{ as: 'h4' }}
                          colorVariant={HeadingColor.WHITE}
                          type={HeadingType.NORMAL}>
                          Uploading
                        </Heading>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </Dropzone>
    </div>
  );
};
Upload.defaultProps = {
  title: 'Drag and Drop your file here!',
  supportedDescription: '',
  mimes: [],
  isMultiple: false,
  loading: false,
};
export default themr<UploadProps>('Select', styles)(Upload);
