import { useEffect } from 'react';
import {
  Redirect,
  Route,
  RouteProps,
  useHistory,
  useLocation,
} from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';

export const PrivateRoute: React.FC<RouteProps> = ({
  children,
  ...rest
}) => {
  const { user, authInfo } = useAuth();

  return (
    <Route
      {...rest}
      render={({ location }) => {
        return user
          ? children
          : (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: location },
              }}
            />
          )
      }}
    />
  );
}

export const LoginRoute: React.FC<RouteProps> = ({
  children,
  ...rest
}) => {
  const { user } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const { from } = (location.state as any)?.state || { from: { pathname: '/' } }

  useEffect(() => {
    if (user) {
      history.push(from.pathname)
    }
  }, [user])

  return (
    <Route {...rest}>
      {children}
    </Route>
  )
}
