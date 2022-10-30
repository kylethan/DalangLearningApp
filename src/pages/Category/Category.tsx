import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router'
import {
    IonButton,
    IonButtons,
    IonCheckbox,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonRow,
    IonText,
    IonTitle,
    IonToolbar,
} from '@ionic/react'
import {
    chevronForwardOutline,
    archiveOutline,
    addCircleOutline,
} from 'ionicons/icons'

import {
    addUserConversation,
    getUserConversations,
    setUserConversations,
    words,
} from '../../api/handler'
import { useAuth } from '../../hooks/useAuth'
import AppContainer from '../../components/AppContainer/AppContainer'
import './Category.css'

const Category: React.FC = () => {
    const history = useHistory()
    const { user } = useAuth()
    const { category } = useParams<{ category: string }>()
    const [wrds, setWords] = useState<Array<any>>([])
    const [conversations, setConversations] = useState<any[]>([])
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
    const [selectedWord, setSelectedWord] = useState<any>(null)
    const [selectedConversations, setSelectedConversations] = useState<any>({})
    const [newConversationName, setNewConversationName] = useState<string>('')

    useEffect(() => {
        setWords(words)
    }, [words])

    useEffect(() => {
        if (user) {
            getUserConversations(user.uid).then(res => setConversations(res))
        }
    }, [user])

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
            const res = wrds.filter(w => (
                String(w.english).toLowerCase().indexOf(searchVal) > -1
                || String(w.dharug).toLowerCase().indexOf(searchVal) > -1
                || String(w.category).toLowerCase().indexOf(searchVal) > -1
            ))
            setWords(res)
        } else {
            setWords(words)
        }
    }

    const updateConversations = async () => {
        const updatingConversations = conversations.map(conversation => ({
            ...conversation,
            sentenceIds: [
                ...conversation.sentenceIds.filter((id: string) => id !== `${selectedWord.id}`),
                ...(selectedConversations[conversation.id]
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
        <AppContainer
            title={category}
            backArrow={true}
            searchFunction={filter}
        >
            {/* <IonGrid style={{ padding: 0, margin: '-1rem ' }}> */}
            {/*     {wrds.filter(word => word.category == category).map(word => ( */}
            {/*         <IonRow className='word-list' key={word.id}> */}
            {/*             <IonCol size="8"> */}
            {/*                 <IonItem lines='none'> */}
            {/*                     <IonText> */}
            {/*                         {word.english} */}
            {/*                     </IonText> */}
            {/*                 </IonItem> */}
            {/*             </IonCol> */}

            {/*             <IonCol size="4"> */}
            {/*                 <IonItem lines='none'> */}
            {/*                     <IonButton */}
            {/*                         className='green-btn' */}
            {/*                         fill='clear' */}
            {/*                         slot='start' */}
            {/*                         style={{ marginRight: 4 }} */}
            {/*                         onClick={() => { */}
            {/*                             setSelectedWord(word) */}
            {/*                             setIsOpenModal(true) */}
            {/*                         }} */}
            {/*                     > */}
            {/*                         <IonIcon color='light' icon={archiveOutline} /> */}
            {/*                     </IonButton> */}

            {/*                     <IonButton */}
            {/*                         className='green-btn' */}
            {/*                         fill='clear' */}
            {/*                         slot='end' */}
            {/*                         onClick={() => history.push(`/play/${word.id}`)} */}
            {/*                     > */}
            {/*                         <IonIcon color='light' icon={chevronForwardOutline} /> */}
            {/*                     </IonButton> */}
            {/*                 </IonItem> */}
            {/*             </IonCol> */}
            {/*         </IonRow> */}
            {/*     ))} */}
            {/* </IonGrid> */}

            <IonList style={{ padding: 0, margin: '-1rem ' }}>
                {wrds.filter(word => word.category == category).map(word => (
                    <IonItem
                        key={word.id}
                        className="word-item"
                        lines="inset"
                    >
                        <IonText>
                            <p>{word.english}</p>
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

export default Category
