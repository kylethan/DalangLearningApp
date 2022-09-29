import React, { ReactNode } from 'react';
import { useHistory } from 'react-router';
import {
    IonButtons,
    IonButton,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonItem,
    IonMenuButton,
    IonPage,
    IonRow,
    IonSearchbar,
    IonText,
    IonToolbar,
    IonBackButton,
} from '@ionic/react';
import { arrowBack } from 'ionicons/icons'

import './AppContainer.css';

interface AppContainerProps {
    children: ReactNode;
    title?: string;
    backButton?: boolean;
    backArrow?: boolean;
    searchFunction?: any;
}

const AppContainer: React.FC<AppContainerProps> = ({
    children,
    title = '',
    backButton = false,
    backArrow = false,
    searchFunction = () => {},
}) => {
    const history = useHistory()
    
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar style={{ marginTop: '1.2rem' }}>
                    <IonButtons slot="start" color='light'>
                        {backButton
                            ? <IonBackButton defaultHref='/categories' color='light' />
                            : <IonMenuButton color='light' />
                        }
                    </IonButtons>

                    {!backButton && <IonSearchbar placeholder='Search' onIonChange={searchFunction} />}
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonGrid className='header'>
                    {title && (
                        <IonRow className='breadcrumb'>
                            <IonItem lines='none' style={{ padding: '.5rem 0' }}>
                                {backArrow && (
                                    <IonButton fill='clear' color='light' slot='start' onClick={() => history.goBack()}>
                                        <IonIcon icon={arrowBack} />
                                    </IonButton>
                                )}

                                <IonText color='light' style={{ color: '#fff' }}>
                                    {title}
                                </IonText>
                            </IonItem>
                        </IonRow>
                    )}
                </IonGrid>

                <div className='ion-padding'>
                    {children}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default AppContainer;
