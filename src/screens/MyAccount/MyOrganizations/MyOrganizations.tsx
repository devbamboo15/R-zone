import * as React from 'react';
import { TableRow, TableCell } from 'semantic-ui-react';
import Table from 'src/components/Table';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import Heading, { HeadingColor, HeadingType } from 'src/components/Heading';
import Spinner from 'src/components/Spinner';
import get from 'lodash/get';
// import SaveIcon from 'assets/icons/save.svg';
// import Footer from 'src/components/Footer';

export type MyOrganizationsProps = IComponentProps & {
  getAllOrganizations: Function;
  organizations: any;
  organizationsLoading: boolean;
  setOrganization: Function;
  organizationId: string;
};

class MyOrganizations extends React.Component<MyOrganizationsProps> {
  componentDidMount() {
    this.props.getAllOrganizations();
  }

  setCurrentOrganization = (id: string) => {
    this.props.setOrganization(id);
  };

  render() {
    const {
      classes,
      organizations,
      organizationsLoading,
      organizationId,
    } = this.props;
    return (
      <div>
        <Table fields={['Organization', 'Organizer', 'Added By', 'Actions']}>
          {organizations.map((item: any) => (
            <TableRow className={classes.table_row} key={item.id}>
              <TableCell>
                <Heading headingProps={{ as: 'h4' }} type={HeadingType.NORMAL}>
                  {get(item, 'attributes.name')}
                </Heading>
              </TableCell>
              <TableCell>
                <Heading
                  headingProps={{ as: 'h5' }}
                  type={HeadingType.NORMAL}
                  colorVariant={HeadingColor.GRAY}>
                  {get(item, 'attributes.email')}
                </Heading>
              </TableCell>
              <TableCell>
                <Heading
                  headingProps={{ as: 'h5' }}
                  type={HeadingType.NORMAL}
                  colorVariant={HeadingColor.GRAY}>
                  {get(item, 'attributes.added_by')}
                </Heading>
              </TableCell>
              <TableCell>
                {organizationId === item.id ? (
                  <Heading
                    headingProps={{ as: 'h5' }}
                    type={HeadingType.NORMAL}
                    colorVariant={HeadingColor.PRIMARY}>
                    Logged In
                  </Heading>
                ) : (
                  <Button
                    buttonType={ButtonType.TRANSPARENT}
                    colorVariant={ButtonColor.RED}
                    buttonProps={{
                      onClick: () => this.setCurrentOrganization(item.id),
                    }}>
                    Login to Org
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </Table>
        {organizationsLoading && <Spinner />}
        {/* <Footer>
          <div className="bottomBar">
            <Button
              icon={<SaveIcon height={16} />}
              colorVariant={ButtonColor.PRIMARY}
              buttonType={ButtonType.ROUND}>
              Save
            </Button>
          </div>
        </Footer> */}
      </div>
    );
  }
}

export default MyOrganizations;
