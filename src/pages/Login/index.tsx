import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import firebase from 'firebase/compat/app';
import { Props } from 'react-firebaseui';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import 'firebase/compat/auth';
import {
    IonContent,
    IonPage, IonTitle
} from '@ionic/react';

import { useAuth } from '../../hooks/useAuth';
import './index.css';

const logoIcon = 'https://cdn-icons-png.flaticon.com/512/6550/6550029.png?fbclid=IwAR1mWo38GKUkA6DBenA-fe_PoOoUR4nwI80YhIJSatpzaa-IchYQ6Q-5nv4';

const uiConfig: Props['uiConfig'] = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        {
            provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
            defaultCountry: 'AU',
        }
    ],
};

const Login: React.FC = () => {
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
        <IonPage>
            <IonContent fullscreen>
                <div className="login-container">
                    <img
                        className="icon"
                        src={logoIcon}
                        alt="dalang-logo"
                        width="150"
                        height="150"
                    />
                    <IonTitle color='light' size='large'>Dalang Learning App</IonTitle>
                    <br/>
                    <StyledFirebaseAuth
                        uiConfig={uiConfig}
                        firebaseAuth={firebase.auth()}
                    />
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Login;
