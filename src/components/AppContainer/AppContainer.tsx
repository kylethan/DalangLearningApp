import React from 'react';
import { IonButtons, IonButton, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonMenuButton, IonPage, IonRow, IonSearchbar, IonText, IonToolbar, IonBackButton } from '@ionic/react';
import { funnel, appsSharp, list, star, helpCircle, arrowBack, logoAlipay } from 'ionicons/icons'
import { ReactNode } from 'react';
import './AppContainer.css';
import { useHistory } from 'react-router';

interface AppContainerProps {
    children: ReactNode;
    category?: string;
    backButton?: boolean;
    searchFunction?: any;
}

const AppContainer: React.FC<AppContainerProps> = ({ children, category = '', backButton = false, searchFunction = () => {} }) => {
    const history = useHistory()
    
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar style={{ marginTop: '1.2rem' }}>
                    <IonButtons slot="start" color='light'>
                        {
                            backButton ?
                            <IonBackButton defaultHref='/categories' color='light' />
                            :
                            <IonMenuButton color='light' />
                        }
                    </IonButtons>
                    { !backButton && <IonSearchbar placeholder='Search' onIonChange={searchFunction} /> }
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonGrid className='header'>
                    {
                        category &&
                        <IonRow className='breadcrumb'>
                            <IonItem lines='none' style={{ padding: '.5rem 0' }}>
                                <IonButton fill='clear' color='light' slot='start' onClick={() => history.goBack()}>
                                    <IonIcon icon={arrowBack} />
                                </IonButton>
                                <IonText color='light' style={{ color: '#fff' }}>
                                    {category}
                                </IonText>
                            </IonItem>
                        </IonRow>
                    }
                </IonGrid>

                <div className='ion-padding'>
                    { children }
                </div>
            </IonContent>
        </IonPage>
    );
};

export default AppContainer;
