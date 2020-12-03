import ProgramSvg from 'assets/images/program_icon.svg';
import ReaderSvg from 'assets/icons/reader.svg';
import InviteSvg from 'assets/icons/invite.svg';
import ShareSvg from 'assets/icons/share.svg';
import ReportSvg from 'assets/icons/report.svg';
import ProgressBadgesSvg from 'assets/icons/progressBadges.svg';
import AccountSvg from 'assets/icons/account.svg';
import URL from './urls';

const menus = [
  {
    name: 'Programs',
    Icon: ProgramSvg,
    path: URL.PROGRAMS(),
  },
  {
    name: 'Manage Readers',
    Icon: ReaderSvg,
    path: URL.MANAGE_READERS(),
  },
  {
    name: 'Invite Readers',
    Icon: InviteSvg,
    path: URL.INVITE_READERS(),
  },
  {
    name: 'Share / Promote',
    Icon: ShareSvg,
    path: URL.SHARE(),
  },
  {
    name: 'Progress Badges',
    Icon: ProgressBadgesSvg,
    path: URL.PROGRESS_BADGES(),
  },
  {
    name: 'Reports',
    Icon: ReportSvg,
    path: URL.REPORTS(),
  },
  // {
  //   name: 'Tutorials',
  //   Icon: TutSvg,
  //   path: URL.LOGIN(),
  // },
  {
    name: 'My Account',
    Icon: AccountSvg,
    path: URL.MYACCOUNT(),
  },
];

export default menus;
