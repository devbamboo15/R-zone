import * as Yup from 'yup';

const yupValidate = Yup.object().shape({
  reader: Yup.string().required('Reader is required'),
  program: Yup.string().when('reader', reader => {
    return !reader
      ? Yup.string().nullable()
      : Yup.string().required('Program is Required');
  }),
  group: Yup.string().when('program', program => {
    return !program
      ? Yup.string().nullable()
      : Yup.string().required('Group is Required');
  }),
  metric: Yup.string().when(['group', 'metricId'], (group, metricId) => {
    return !group || metricId === 'yes/no'
      ? Yup.string().nullable()
      : Yup.string().required('Metric is Required');
  }),
  yesNo: Yup.string().when('metricId', metricId => {
    return metricId !== 'yes/no'
      ? Yup.string().nullable()
      : Yup.bool().oneOf([true, false], 'Field must be checked');
  }),
  book: Yup.string().when(
    ['metric', 'metricId', 'role'],
    (metric, metricId, role) => {
      return metric && metricId === 'books' && role === 'reader'
        ? Yup.string().required('Book is Required')
        : Yup.string().nullable();
    }
  ),
});

export { yupValidate };
