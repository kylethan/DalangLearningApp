import React, { useEffect, useMemo, useState } from 'react';
import {
    IonButton,
    IonCol,
    IonGrid,
    IonIcon,
    IonItem,
    IonRouterLink,
    IonRow,
    IonText,
} from '@ionic/react';
import { chevronForwardOutline } from 'ionicons/icons';

import { getUserConversations, words } from '../../api/handler';
import { useAuth } from '../../hooks/useAuth';
import AppContainer from '../../components/AppContainer/AppContainer';
import './index.css';

const Conversations: React.FC = () => {
    const { user } = useAuth()
    const [conversations, setConversations] = useState<any[]>([])

    useEffect(() => {
        if (user) {
            getUserConversations(user.uid).then(res => setConversations(res))
        }
    }, [user])

    return (
        <AppContainer>
            <IonGrid style={{ padding: 0, margin: '-1rem ' }}>
                {conversations.map(conversation => (
                    <IonRouterLink routerLink={`/play/${conversation.name}`} key={conversation.name}>
                        <IonRow className='word-list'>
                            <IonCol size='9'>
                                <IonItem lines='none'>
                                    <IonText>
                                        {conversation.name}
                                    </IonText>
                                </IonItem>

                                {/* <IonItem lines='none'> */}
                                {/*     <IonText> */}
                                {/*         <b>Dharug:</b> <br /> { word.dharug } */}
                                {/*     </IonText> */}
                                {/* </IonItem> */}
                            </IonCol>

                            <IonCol size='3'>
                                <IonItem lines='none'>
                                    <IonButton fill='clear' slot='end' className='green-btn'>
                                        <IonIcon color='light' icon={chevronForwardOutline} />
                                    </IonButton>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                    </IonRouterLink>
                ))}
            </IonGrid>
        </AppContainer>

    );
};

export default Conversations;
