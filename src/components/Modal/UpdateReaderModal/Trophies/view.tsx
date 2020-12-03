import * as React from 'react';
import { map, get } from 'lodash';
import Table from 'src/components/Table';
import TrophySvg from 'src/assets/icons/trophy.svg';
import { TableRow, TableCell, Grid } from 'semantic-ui-react';
import Heading, { HeadingType, HeadingColor } from 'src/components/Heading';

export type TrophiesProps = IComponentProps & {
  trophies: any[];
};
class Trophies extends React.Component<TrophiesProps> {
  render() {
    const { classes, trophies } = this.props;
    return (
      <div>
        <Grid textAlign="center">
          {trophies.length === 0 ? (
            <div className={classes.trophiesEmptyContainer}>
              <Heading
                headingProps={{ as: 'h3' }}
                colorVariant={HeadingColor.CYAN}
                type={HeadingType.BOLD_600}>
                No Awards Found!
              </Heading>
              <div className={classes.trophiesEmptyText}>
                <Heading
                  headingProps={{ as: 'p' }}
                  colorVariant={HeadingColor.CYAN}
                  type={HeadingType.NORMAL}>
                  This award case is empty! Keep reading!
                </Heading>
              </div>
            </div>
          ) : (
            <Table
              fields={['Image', 'Title', 'Quantity']}
              tableProps={{ className: classes.tableContainer }}>
              {map(trophies, (trophy: any, index: number) => {
                return (
                  <TableRow className={classes.tableRow} key={index}>
                    <TableCell>
                      <Heading
                        headingProps={{ as: 'h4' }}
                        type={HeadingType.NORMAL}>
                        <TrophySvg height={72} />
                      </Heading>
                    </TableCell>
                    <TableCell>
                      <Heading
                        headingProps={{ as: 'h5' }}
                        type={HeadingType.NORMAL}
                        colorVariant={HeadingColor.GRAY}>
                        {get(trophy, 'title')}
                      </Heading>
                    </TableCell>
                    <TableCell>
                      <Heading
                        headingProps={{ as: 'h5' }}
                        type={HeadingType.NORMAL}
                        colorVariant={HeadingColor.GRAY}>
                        {get(trophy, 'quantity')}
                      </Heading>
                    </TableCell>
                  </TableRow>
                );
              })}
            </Table>
          )}
        </Grid>
      </div>
    );
  }
}
export default Trophies;
