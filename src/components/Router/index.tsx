import { useEffect } from 'react';
import {
  Redirect,
  Route,
  RouteProps,
  useHistory,
  useLocation,
} from 'react-router-dom';
import { UserInfo } from 'firebase/auth';

import { useAuth } from '../../hooks/useAuth';
import {
  addUserConversation,
  getDefaultConversations,
  getUser,
  setUser,
} from '../../api/handler';

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

  const assureUserData = async (user: UserInfo) => {
    const { uid, phoneNumber } = user
    let userData = await getUser(uid)

    if (!userData) {
      userData = {
        uid,
        phoneNumber,
        isGenConversation: false,
      }
    }

    if (!userData.isGenConversation) {
      const conversations = await getDefaultConversations();
      if (conversations) {
        await Promise.all(conversations.map(con => addUserConversation(uid, con)))
      }
      await setUser(uid, {
        ...userData,
        isGenConversation: true,
      })
    }
  }

  useEffect(() => {
    if (user) {
      assureUserData(user);
      history.push(from.pathname)
    }
  }, [user])

  return (
    <Route {...rest}>
      {children}
    </Route>
  )
}
