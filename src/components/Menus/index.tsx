import * as React from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import themr from 'src/helpers/themr';
import cn from 'classnames';
import { Header } from 'semantic-ui-react';
import menus from 'src/helpers/menus';
// import URL from 'src/helpers/urls';
import styles from './styles.scss';

export type MenusProps = IComponentProps &
  RouteComponentProps & {
    badgesAccount?: any;
    isOrganizer: boolean;
  };

const Menus = ({
  history: {
    location: { pathname },
  },
  classes,
  isOrganizer,
}: // badgesAccount,
MenusProps) => {
  let menusToRender;
  if (!isOrganizer) {
    menusToRender = menus.filter(x => x.path === '/my-account');
  } else {
    menusToRender = menus;
  }
  return (
    <div className={classes.menu_items}>
      {menusToRender.map(menu => {
        // if (badgesAccount !== 1 && menu.path === URL.PROGRESS_BADGES()) {
        //   return '';
        // }
        return (
          <Link key={menu.name} to={menu.path}>
            <Header
              as="h4"
              className={cn(classes.menu_item, {
                [classes.menu_item_active]: pathname === menu.path,
              })}>
              <menu.Icon height={16} width={16} />
              <span className={classes.menu_text}>{menu.name}</span>
            </Header>
          </Link>
        );
      })}
    </div>
  );
};

export default withRouter(themr<MenusProps>('Menus', styles)(Menus));
