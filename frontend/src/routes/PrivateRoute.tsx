import { Outlet } from "react-router-dom";

interface PropsTypes {
  allowedRoles: string[];
}

const PrivateRoute: React.FC<PropsTypes> = ({ allowedRoles }) => {
  return <Outlet />;
};

export default PrivateRoute;
