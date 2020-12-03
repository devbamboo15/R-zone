import { compose, withHandlers, withState } from 'recompose';
import get from 'lodash/get';
import toast from 'src/helpers/Toast';
import BulkImport, { BulkImportProps, ComponentProps } from './BulkImport';

const excelToJSON = (file: File, setIsUpload, addUsers) => {
  const XLSX = require('xlsx');
  const reader = new FileReader();
  reader.onload = () => {
    const data = reader.result;
    const workbook = XLSX.read(data, { type: 'binary' });
    const sheetNames = workbook.SheetNames;
    const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]], {
      header: 'A',
    });
    setIsUpload(false);
    addUsers(xlData, file.name);
  };
  reader.readAsBinaryString(file);
};

export default compose<BulkImportProps, ComponentProps>(
  withState('isUpload', 'setIsUpload', false),
  withHandlers({
    onUploadBulk: ({ setIsUpload, addUsers }) => (files: File) => {
      const fileNameArr = get(files, '[0].name', '').split('.') || [];
      const fileEx = fileNameArr[fileNameArr.length - 1];
      if (['csv', 'xls', 'xlsx', 'xml'].indexOf(fileEx) >= 0) {
        setIsUpload(true);
        excelToJSON(files[0], setIsUpload, addUsers);
        return files;
      }
      toast.error('Invalid file type.');

      return false;
    },
  })
)(BulkImport);
