import * as RA from "react-admin";
import { MyMenu } from "./Menu";
import { MyAppBar } from "./MyAppBar";

export const Layout = (props: any) => {
  return <RA.Layout {...props} menu={MyMenu} appBar={MyAppBar} />;
};

export default Layout;
