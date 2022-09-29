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
import Home from './pages/Home/Home';
import Category from './pages/Category/Category';
import Play from './pages/Play/Play';
import Login from './pages/Login';
import Conversations from './pages/Conversations';
import { LoginRoute, PrivateRoute } from './components/Router';
import Menu from './components/Menu/Menu';
/* Theme variables */
import './theme/variables.css';
import './App.css';

setupIonicReact();

const App: React.FC = () => {
  return (
    <ProvideAuth>
      <IonApp>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu />

            <IonRouterOutlet id="main">
              <LoginRoute path="/login" exact={true}>
                <Login />
              </LoginRoute>

              <PrivateRoute path="/categories" exact={true}>
                <Home />
              </PrivateRoute>

              <PrivateRoute path="/" exact={true}>
                <Redirect to="/categories" />
              </PrivateRoute>

              <PrivateRoute path="/categories/:category" exact={true}>
                <Category />
              </PrivateRoute>

              <PrivateRoute path="/play/:id" exact={true}>
                <Play />
              </PrivateRoute>

              <PrivateRoute path="/conversations" exact={true}>
                <Conversations />
              </PrivateRoute>
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
    </ProvideAuth>
  )};

export default App;
