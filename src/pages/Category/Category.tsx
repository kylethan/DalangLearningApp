import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import {
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonItem,
    IonModal,
    IonRouterLink,
    IonRow,
    IonText,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import { chevronForwardOutline, archiveOutline } from 'ionicons/icons';

import { words } from '../../api/handler';
import AppContainer from '../../components/AppContainer/AppContainer';
import './Category.css';

const Category: React.FC = () => {
    const history = useHistory()
    const { category } = useParams<{ category: string; }>();
    const [ wrds, setWords ] = useState<Array<any>>([])
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [selectedWord, setSelectedWord] = useState<any>(null);

    useEffect(() => {
        setWords(words)
    }, [words])

    const filter = (e: any) => {
        const searchVal = String(e.detail.value).toLowerCase();
        if(searchVal) {
            const res = wrds.filter(w => (
                String(w.english).toLowerCase().indexOf(searchVal) > -1
                || String(w.dharug).toLowerCase().indexOf(searchVal) > -1
                || String(w.category).toLowerCase().indexOf(searchVal) > -1
            ))
            setWords(res)
        } else {
            setWords(words);
        }
    }

    return (
        <AppContainer
            title={category}
            backArrow={true}
            searchFunction={filter}
        >
            <IonGrid style={{ padding: 0, margin: '-1rem ' }}>
                {wrds.filter(word => word.category == category).map(word => (
                    // <IonRouterLink routerLink={`/play/${word.id}`} key={word.id}>
                        <IonRow className='word-list'>
                            <IonCol size="8">
                                <IonItem lines='none'>
                                    <IonText>
                                        {word.english}
                                    </IonText>
                                </IonItem>

                                {/* <IonItem lines='none'> */}
                                {/*     <IonText> */}
                                {/*         <b>Dharug:</b> <br /> { word.dharug } */}
                                {/*     </IonText> */}
                                {/* </IonItem> */}
                            </IonCol>

                            <IonCol size="4">
                                <IonItem lines='none'>
                                    <IonButton
                                        className='green-btn'
                                        fill='clear'
                                        slot='start'
                                        style={{ marginRight: 4 }}
                                        onClick={(e) => {
                                            setSelectedWord(word)
                                            setIsOpenModal(true)
                                        }}
                                    >
                                        <IonIcon color='light' icon={archiveOutline} />
                                    </IonButton>

                                    <IonButton
                                        className='green-btn'
                                        fill='clear'
                                        slot='end'
                                        onClick={() => history.push(`/play/${word.id}`)}
                                    >
                                        <IonIcon color='light' icon={chevronForwardOutline} />
                                    </IonButton>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                    // </IonRouterLink>
                ))}
            </IonGrid>

            <IonModal isOpen={isOpenModal}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Modal</IonTitle>

                        <IonButtons slot="end">
                            <IonButton
                                onClick={(e) => {
                                    setSelectedWord(null)
                                    setIsOpenModal(false)
                                }}
                            >
                                Close
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <IonContent className="ion-content ion-padding">
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni illum quidem recusandae ducimus quos
                        reprehenderit. Veniam, molestias quos, dolorum consequuntur nisi deserunt omnis id illo sit cum qui.
                        Eaque, dicta.
                    </p>
                </IonContent>
            </IonModal>
        </AppContainer>
    );
};

export default Category;
