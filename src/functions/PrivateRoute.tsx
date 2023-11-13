import React, { ComponentType } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

interface PrivateRouteProps extends RouteProps {
  component: ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const user: any | null = JSON.parse(localStorage.getItem("user") || "null");
  return (
    <Route
      {...rest}
      render={(props) =>
        user? <Component {...props} /> : <Redirect to="/all-news" />
      }
    />
  );
};

export default PrivateRoute;
