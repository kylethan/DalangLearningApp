import React from 'react';
import firebase from 'firebase/compat/app';
import { Props as ReactFirebaseUIProps } from 'react-firebaseui';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import 'firebase/compat/auth';
import {
    IonContent,
    IonPage, IonTitle
} from '@ionic/react';

import './index.css';

const logoIcon = 'https://cdn-icons-png.flaticon.com/512/6550/6550029.png?fbclid=IwAR1mWo38GKUkA6DBenA-fe_PoOoUR4nwI80YhIJSatpzaa-IchYQ6Q-5nv4';

const uiConfig: ReactFirebaseUIProps['uiConfig'] = {
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
