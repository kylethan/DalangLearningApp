import React, { useEffect, useState } from 'react';
import './Home.css';
import AppContainer from '../../components/AppContainer/AppContainer';
import { IonCol, IonIcon, IonItem, IonRow, IonText, IonRouterLink, IonNav, IonButton, useIonAlert, IonLoading, IonBackButton, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonContent } from '@ionic/react';
import { earth } from 'ionicons/icons';
import { words, getWords } from '../../api/handler';

import { setUpDb } from '../../api/handler';

const Home: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [wrds, setWords] = useState<Array<any>>([])
    const [showLoading, setShowLoading] = useState(true);
    const [present] = useIonAlert();

    const init = async () => {
        setShowLoading(true)
        try {
            const res = await getWords();
            setWords(res)
        }
        catch {
            present({
                header: `Error`,
                message: `An error occurred while updating list, please try again`,
                buttons: [
                    'OK'
                ],
            })
        }
        finally {
            setShowLoading(false)
        }
    }

    const filter = (e: any) => {
        const searchVal = String(e.detail.value).toLowerCase();
        if (searchVal) {
            const res = wrds.filter(w => (
                String(w.english).toLowerCase().indexOf(searchVal) > -1
                ||
                String(w.dharug).toLowerCase().indexOf(searchVal) > -1
                ||
                String(w.category).toLowerCase().indexOf(searchVal) > -1
            ))
            setWords(res)
        } else {
            setWords(words);
        }
    }

    useEffect(() => {
        init();
    }, [])

    useEffect(() => {
        setWords(words)
    }, [words])

    return (
        <AppContainer searchFunction={filter}>
            {/* { <IonButton onClick={() => setUpDb()}> 
                setup
            </IonButton> } */}
            <IonRow>
                {
                    [...new Set(wrds.map(word => word.category))].map((category, key) => (
                        <IonCol size="4" className='custom' key={key}>
                            <IonRouterLink routerLink={`/categories/${category}`}>
                                {/* <IonIcon icon={earth} /> */}
                                <IonText>
                                    {category}
                                </IonText>
                            </IonRouterLink>
                        </IonCol>
                    ))
                }
            </IonRow>
            {
                // showLoading &&
                // <IonLoading
                //     isOpen={showLoading}
                //     onDidDismiss={() => setShowLoading(false)}
                //     message={'Updating List...'}
                // />
            }
        </AppContainer>

    );
};

export default Home;
