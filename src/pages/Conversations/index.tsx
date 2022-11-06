import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonList,
    IonModal,
    IonText,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import { chevronForwardOutline, createOutline, trash } from 'ionicons/icons';

import {
    deleteUserConversation,
    getUserConversations,
    setUserConversation,
} from '../../api/handler';
import { useAuth } from '../../hooks/useAuth';
import AppContainer from '../../components/AppContainer/AppContainer';
import './index.css';

const Conversations: React.FC = () => {
    const history = useHistory()
    const { user } = useAuth()
    const [conversations, setConversations] = useState<any[]>([])
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
    const [selectedConversation, setSelectedConversation] = useState<any>(null)
    const [updatingConversationName, setUpdatingConversationName] = useState<string>('')

    useEffect(() => {
        getUserConversations(user?.uid).then(res => {
            setConversations(res);
        })
    }, [])

    useEffect(() => {
        if (user) {
            getUserConversations(user.uid).then(res => {
                setConversations(res);
            })
        }
    }, [user])

    const renameConversation = async () => {
        if (selectedConversation) {
            const updatingConversation = {
                ...selectedConversation,
                name: updatingConversationName,
            }
            await setUserConversation(user?.uid, updatingConversation)
            setConversations(conversations.map(it => {
                if (it.id === updatingConversation.id) {
                    return updatingConversation
                }

                return it
            }))
        }
    }

    const deleteConversation = async (conversationId: string) => {
        await deleteUserConversation(user?.uid, conversationId)
        setConversations(conversations.filter(({ id }) => id !== conversationId))
    }

    return (
        <AppContainer>
            <IonList style={{ padding: 0, margin: '-1rem ' }}>
                {conversations.map(conversation => (
                    <IonItemSliding key={conversation.id}>
                        <IonItem className="category-item" lines="inset"
                        onClick={() => history.push(`/conversations/${conversation.id}`)}>
                            <IonText>
                                {conversation.name}
                            </IonText>

                            <IonButton
                                fill="clear"
                                slot="end"
                                className="green-btn"
                                
                            >
                                <IonIcon color="light" icon={chevronForwardOutline} />
                            </IonButton>
                        </IonItem>

                        <IonItemOptions>
                            <IonItemOption
                                color="warning"
                                onClick={() => {
                                    setSelectedConversation(conversation)
                                    setIsOpenModal(true)
                                }}>
                                <IonIcon
                                    color="light"
                                    slot="icon-only"
                                    icon={createOutline}
                                    size="large"
                                />
                            </IonItemOption>

                            <IonItemOption color="danger" onClick={() => deleteConversation(conversation.id)}>
                                <IonIcon
                                    color="light"
                                    slot="icon-only"
                                    icon={trash}
                                    size="large"
                                />
                            </IonItemOption>
                        </IonItemOptions>
                    </IonItemSliding>
                ))}
            </IonList>

            <IonModal isOpen={isOpenModal}>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonButton
                                color="medium"
                                onClick={() => {
                                    setSelectedConversation(null)
                                    setIsOpenModal(false)
                                    setUpdatingConversationName('')
                                }}
                            >
                                Close
                            </IonButton>
                        </IonButtons>

                        <IonTitle>Rename conversation</IonTitle>

                        <IonButtons slot="end">
                            <IonButton
                                onClick={() => {
                                    setIsOpenModal(false)
                                    renameConversation().then(() => {
                                        setSelectedConversation(null)
                                        setUpdatingConversationName('')
                                    })
                                }}
                            >
                                Confirm
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <IonContent className="ion-content ion-padding">
                    <IonItem
                        className="new-conversation-input"
                        lines="none"
                    >
                        <IonInput
                            value={updatingConversationName}
                            placeholder="Rename conversation"
                            onIonChange={(e) => setUpdatingConversationName(`${e.detail.value}`)}
                        />
                    </IonItem>
                </IonContent>
            </IonModal>
        </AppContainer>

    );
};

export default Conversations;
