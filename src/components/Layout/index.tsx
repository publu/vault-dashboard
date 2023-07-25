import * as RA from 'react-admin'
import { MyMenu } from './Menu'
import { MyAppBar } from './MyAppBar'

export const Layout = (props: any) => {
    return <RA.Layout {...props} children={<div className="mt-3"> {props.children} </div>} menu={MyMenu} appBar={MyAppBar} />
}

export default Layout
