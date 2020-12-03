import * as React from 'react';
import themr from 'src/helpers/themr';
import cx from 'classnames';
import { Table as BaseTable, TableProps, Popup } from 'semantic-ui-react';
import Checkbox from 'src/components/FormFields/Checkbox';
import Heading, { HeadingColor, HeadingType } from 'src/components/Heading';
import Button, { ButtonType } from 'src/components/Button';
import DeleteIcon from 'src/assets/icons/delete.svg';
import styles from './styles.scss';

export type BaseTableProps = IComponentProps & {
  tableProps?: TableProps;
  widths?: any[];
  accordian?: boolean;
  children?: any;
  select?: boolean;
  onSelectAll?: (event: any, data: any) => void;
  fields?: string[];
  deleteAllDisplay?: boolean;
  currentcheckAll?: boolean;
  onDeleteAll?: any;
  customColumn?: any;
  disableSelect?: boolean;
  disableDeleteAll?: boolean;
};

const Table = (props: BaseTableProps) => {
  const {
    classes,
    fields,
    children,
    tableProps,
    widths,
    select,
    accordian,
    onSelectAll,
    deleteAllDisplay,
    onDeleteAll,
    currentcheckAll,
    customColumn,
    disableSelect,
    disableDeleteAll,
  } = props;
  return (
    <BaseTable padded {...tableProps}>
      <BaseTable.Header>
        <BaseTable.Row className={classes.table_row}>
          {select && (
            <>
              <BaseTable.HeaderCell
                className={cx(classes.table_header_row, classes.centerCell)}
                width={1}
              />
              <BaseTable.HeaderCell
                className={cx(classes.table_header_row, classes.centerCell)}
                width={1}>
                <Checkbox
                  secondary
                  center
                  checkboxProps={{
                    onChange: onSelectAll,
                    checked: currentcheckAll,
                    disabled: disableSelect,
                  }}
                />
                <Heading
                  headingProps={{
                    as: 'h5',
                    textAlign: 'center',
                    className: 'selectAllHeading',
                  }}
                  colorVariant={HeadingColor.SECONDARY}
                  type={HeadingType.NORMAL}>
                  Select All
                </Heading>
              </BaseTable.HeaderCell>
            </>
          )}

          {fields.map((showitem, index) => (
            <BaseTable.HeaderCell
              className={cx(classes.table_header_row, {
                [classes.accordian_table]: accordian && index === 0,
              })}
              width={widths ? widths[index] : null}
              key={showitem}>
              {deleteAllDisplay && index === fields.length - 1 ? (
                <Popup
                  content="An organization needs at least one Owner."
                  wide
                  position="top right"
                  size="small"
                  disabled={!disableDeleteAll}
                  trigger={
                    <div className={classes.buttonDelete}>
                      <div style={{ float: 'left', marginTop: '4px' }}>
                        {showitem}
                      </div>
                      <div
                        style={{
                          float: 'left',
                          marginTop: '2px',
                          marginLeft: '15px',
                        }}>
                        <Button
                          buttonProps={{
                            size: 'tiny',
                            onClick: onDeleteAll,
                            disabled: disableDeleteAll,
                          }}
                          buttonType={ButtonType.TRANSPARENT}>
                          <DeleteIcon height={20} />
                        </Button>
                      </div>
                    </div>
                  }
                />
              ) : customColumn && customColumn.index === index ? (
                <>{customColumn.content}</>
              ) : (
                showitem
              )}
            </BaseTable.HeaderCell>
          ))}
        </BaseTable.Row>
      </BaseTable.Header>

      <BaseTable.Body>{children}</BaseTable.Body>
    </BaseTable>
  );
};

Table.defaultProps = {
  width: null,
  select: false,
};

export default themr<BaseTableProps>('Table', styles)(Table);
