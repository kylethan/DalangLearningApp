import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router'
import {
    IonButton,
    IonButtons,
    IonCheckbox,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonList,
    IonModal,
    IonText,
    IonTitle,
    IonToolbar,
} from '@ionic/react'
import {
    chevronForwardOutline,
    archiveOutline,
    addCircleOutline,
    trash,
} from 'ionicons/icons'

import {
    addUserConversation,
    getUserConversation,
    getUserConversations,
    setUserConversation,
    setUserConversations,
    words as wordList,
} from '../../api/handler'
import { useAuth } from '../../hooks/useAuth'
import AppContainer from '../../components/AppContainer/AppContainer'
import './index.css'

const ConversationDetail: React.FC = () => {
    const history = useHistory()
    const { conversationId } = useParams<{ conversationId: string }>()
    const { user } = useAuth()
    const [words, setWords] = useState<Array<any>>([])
    const [conversation, setConversation] = useState<any>(null)
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
        }
    }, [user])

    useEffect(() => {
        if (user && conversationId) {
            getUserConversation(user.uid, conversationId).then(res => {
                setConversation(res)
            })
        }
    }, [user, conversationId])

    useEffect(() => {
        if (conversation) {
            const currentWords = wordList.filter(word => conversation.sentenceIds.includes(`${word.id}`))
            setWords(currentWords)
        }
    }, [conversation])

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
            const res = words.filter(w => (
                String(w.english).toLowerCase().indexOf(searchVal) > -1
                || String(w.dharug).toLowerCase().indexOf(searchVal) > -1
                || String(w.category).toLowerCase().indexOf(searchVal) > -1
            ))
            setWords(res)
        } else {
            const currentWords = wordList.filter(word => conversation.sentenceIds.includes(`${word.id}`))
            setWords(currentWords)
        }
    }

    const removeSentence = async (sentenceId: number) => {
        const updatingConversation = {
            ...conversation,
            sentenceIds: conversation.sentenceIds.filter((id: string) => id !== `${sentenceId}`)
        }
        await setUserConversation(user?.uid, updatingConversation)
        setConversation(updatingConversation)
        setConversations(conversations.map((it) => {
            if (it.id === conversation.id) {
                return updatingConversation
            }

            return it
        }))
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
        setConversation(updatingConversations.find(it => it.id === conversation.id))
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
        <AppContainer
            title={conversation?.name}
            backArrow={true}
            searchFunction={filter}
        >
            <IonList style={{ padding: 0, margin: '-1rem ' }}>
                {words.map(word => (
                    <IonItemSliding key={word.id}>
                        <IonItem className="word-item" lines="inset" >
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
                                onClick={() => history.push(`/play/${word.id}`)}
                            >
                                <IonIcon color="light" icon={chevronForwardOutline} />
                            </IonButton>
                        </IonItem>

                        <IonItemOptions>
                            <IonItemOption color="danger" onClick={() => removeSentence(word.id)}>
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

export default ConversationDetail
