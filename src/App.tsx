import { Redirect, Route, RouteProps } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import { ProvideAuth, useAuth } from './hooks/useAuth';
import Menu from './components/Menu/Menu';
import Home from './pages/Home/Home';
import Category from './pages/Category/Category';
import Play from './pages/Play/Play';
import Login from './pages/Login';
/* Theme variables */
import './theme/variables.css';
import './App.css';

setupIonicReact();

const PrivateRoute: React.FC<RouteProps> = ({
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

const App: React.FC = () => {
  return (
    <ProvideAuth>
      <IonApp>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu />

            <IonRouterOutlet id="main">
              <Route path="/login" exact={true} component={Login} />

              {/* <Route path="/categories" exact={true} component={Home} /> */}
              <PrivateRoute path="/categories" exact={true}>
                <Home />
              </PrivateRoute>

              <PrivateRoute path="/" exact={true}>
                <Redirect to="/categories" />
              </PrivateRoute>
              {/* <Route path="/" exact={true}> */}
              {/*   <Redirect to="/categories" /> */}
              {/* </Route> */}

              <PrivateRoute path="/categories/:category" exact={true}>
                <Category />
              </PrivateRoute>
              {/* <Route path="/categories/:category" exact={true}> */}
              {/*   <Category /> */}
              {/* </Route> */}

              <PrivateRoute path="/play/:id" exact={true}>
                <Play />
              </PrivateRoute>
              {/* <Route path="/play/:id" exact={true}> */}
              {/*   <Play /> */}
              {/* </Route> */}
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
    </ProvideAuth>
  )};

export default App;
