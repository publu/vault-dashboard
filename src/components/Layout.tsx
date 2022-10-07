import * as RA from 'react-admin';
import { MyMenu } from './Menu';

export const Layout = (props: any) => {
  return <RA.Layout {...props} menu={MyMenu}/>;
};

export default Layout
