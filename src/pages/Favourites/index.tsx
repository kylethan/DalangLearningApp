import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router'
import {
    IonButton,
    IonButtons,
    IonCheckbox,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonRefresher,
    IonRefresherContent,
    IonText,
    IonTitle,
    IonToolbar,
    RefresherEventDetail,
} from '@ionic/react'
import {
    chevronForwardOutline,
    archiveOutline,
    addCircleOutline,
} from 'ionicons/icons'

import {
    addUserConversation,
    getUserConversations,
    getUserFavouriteSentences,
    setUserConversations,
} from '../../api/handler'
import { useAuth } from '../../hooks/useAuth'
import AppContainer from '../../components/AppContainer/AppContainer'
import './index.css'

const Favourites: React.FC = () => {
    const history = useHistory()
    const location = useLocation()
    const { user } = useAuth()
    const [words, setWords] = useState<Array<any>>([])
    const [favourites, setFavourites] = useState<Array<any>>([])
    const [conversations, setConversations] = useState<any[]>([])
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
    const [selectedWord, setSelectedWord] = useState<any>(null)
    const [selectedConversations, setSelectedConversations] = useState<any>({})
    const [newConversationName, setNewConversationName] = useState<string>('')

    useEffect(() => {
        if (user) {
            getUserConversations(user.uid).then(res => {
                setConversations(res);
            })

            getUserFavouriteSentences(user.uid).then(res => {
                setFavourites(res)
                setWords(res)
            })
        }
    }, [user, location.key])

    useEffect(() => {
        if (selectedWord && conversations) {
            const currentConversations = conversations.reduce((res, cur) => ({
                ...res,
                [cur.id]: cur.sentenceIds.includes(`${selectedWord.id}`),
            }), {})
            setSelectedConversations(currentConversations)
        }
    }, [selectedWord, conversations])

    const filter = (e: any) => {
        const searchVal = String(e.detail.value).toLowerCase()
        if(searchVal) {
            const res = favourites.filter(w => (
                String(w.english).toLowerCase().indexOf(searchVal) > -1
                || String(w.dharug).toLowerCase().indexOf(searchVal) > -1
                || String(w.category).toLowerCase().indexOf(searchVal) > -1
            ))
            setWords(res)
        } else {
            setWords(favourites)
        }
    }

    const updateConversations = async () => {
        const updatingConversations = conversations.map(it => ({
            ...it,
            sentenceIds: [
                ...it.sentenceIds.filter((id: string) => id !== `${selectedWord.id}`),
                ...(selectedConversations[it.id]
                    ? [`${selectedWord.id}`]
                    : []
               ),
            ],
        }))
        await setUserConversations(user?.uid, updatingConversations)
        setConversations(updatingConversations)
    }
    
    const createNewConversation = () => {
        const newConversation = {
            name: newConversationName,
            sentenceIds: [`${selectedWord.id}`],
        }
        setNewConversationName('')
        addUserConversation(user?.uid, newConversation)
            .then(() => getUserConversations(user?.uid))
            .then(res => {
                setConversations(res)
            })
    }

    return (
        
        <AppContainer searchFunction={filter}>
            <IonList style={{ padding: 0, margin: '-1rem ' }}>
                {words.map(word => (
                    <IonItem
                        key={word.id}
                        className="word-item"
                        lines="inset"
                        onClick={() => history.push(`/play/${word.id}`)}
                    >
                        <IonText>
                            <p>{word.english}</p>
                            <h4>{word.dharug}</h4>
                        </IonText>

                        <IonButton
                            className="green-btn"
                            fill="clear"
                            slot="end"
                            style={{ marginRight: 4 }}
                            onClick={() => {
                                setSelectedWord(word)
                                setIsOpenModal(true)
                            }}
                        >
                            <IonIcon color="light" icon={archiveOutline} />
                        </IonButton>

                        <IonButton
                            className="green-btn"
                            fill="clear"
                            slot="end"
                        >
                            <IonIcon color="light" icon={chevronForwardOutline} />
                        </IonButton>
                    </IonItem>
                ))}
            </IonList>

            <IonModal isOpen={isOpenModal}>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonButton
                                color="medium"
                                onClick={() => {
                                    setSelectedWord(null)
                                    setIsOpenModal(false)
                                    setSelectedConversations({})
                                }}
                            >
                                Close
                            </IonButton>
                        </IonButtons>

                        <IonTitle>Modal</IonTitle>

                        <IonButtons slot="end">
                            <IonButton
                                onClick={() => {
                                    setSelectedWord(null)
                                    setIsOpenModal(false)
                                    updateConversations().then(() => setSelectedConversations({}))
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
                        fill="outline"
                    >
                        <IonInput
                            value={newConversationName}
                            placeholder="New conversation name"
                            onIonChange={(e) => setNewConversationName(`${e.detail.value}`)}
                        />

                        <IonButton className="new-conversation-btn" slot="end" onClick={createNewConversation}>
                            <IonIcon slot="start" icon={addCircleOutline} size="small" />

                            Create
                        </IonButton>
                    </IonItem>

                    <IonList className="ion-list" inset>
                        {conversations.map(conversation => (
                            <IonItem key={conversation.id}>
                                <IonCheckbox
                                    slot="start"
                                    name="selectedConversations"
                                    value={conversation.id}
                                    checked={selectedConversations[conversation.id]}
                                    onIonChange={(e) => {
                                        const { detail: { checked, value } } = e
                                        setSelectedConversations({
                                            ...selectedConversations,
                                            [value]: checked,
                                        })
                                    }}
                                />

                                <IonLabel>{conversation.name}</IonLabel>
                            </IonItem>
                        ))}
                    </IonList>
                </IonContent>
            </IonModal>
        </AppContainer>
    )
}

export default Favourites
