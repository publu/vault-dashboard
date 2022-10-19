import { Pagination, PaginationProps } from "react-admin";

const DashPagination = (props: PaginationProps) => {
  // const perPage = 100
  return <Pagination rowsPerPageOptions={[25, 100, 200, 500]} {...props} />;
};

export default DashPagination;
