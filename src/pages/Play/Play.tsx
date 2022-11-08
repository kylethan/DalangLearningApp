import React, {useMemo} from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { useParams } from 'react-router';
import {
    IonButton,
    IonButtons,
    IonCol,
    IonGrid,
    IonIcon,
    IonRow,
    IonText,
} from '@ionic/react';
import {
    pause,
    play,
    stop,
    recording,
    star,
    starOutline,
} from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { Filesystem, Directory } from '@capacitor/filesystem';
import {
  VoiceRecorder,
  RecordingData,
} from 'capacitor-voice-recorder';

import { words, storage, getUserFavouriteSentenceIds, setUser, getUser } from '../../api/handler';
import AppContainer from '../../components/AppContainer/AppContainer';
import './Play.css';
import {useAuth} from '../../hooks/useAuth';

const Play: React.FC = () => {
    const { id } = useParams<{ id: string; }>();
    const { user } = useAuth()
    const [ wrds, setWords ] = useState<Array<any>>([])
    const [favouriteIds, setFavouriteIds] = useState<Array<any>>([])
    const [ word, setWord ] = useState<any>(null)
    const [ playing, setPlaying ] = useState<boolean>(false)
    const [records, setRecords] = useState<any[]>([])
    const [isRecording, setIsRecording] = useState<boolean>(false)
    const [isPlayingRecord, setIsPlayingRecord] = useState<boolean>(false)

    const getFileName = (dharug: string) => {
        return dharug
            .replace(/ /g, '_')
            .replace(',', '')
            .replace('!', '')
            .replace('?', '') + '.wav';
    }
    const fileName = useMemo(() => {
        if (!word) {
            return ''
        }

        return getFileName(word.dharug)
    }, [word])

    const hasRecord = useMemo(() => {
        if (!fileName || !records.length) {
            return false
        }

        return records.includes(fileName)
    }, [records, fileName])

    const addedToFavourite = useMemo(() => favouriteIds.includes(id), [id, favouriteIds])

    const loadFiles = async () => {
        const { files } = await Filesystem.readdir({
            path: '',
            directory: Directory.Data,
        })
        setRecords(files)
    }

    const startRecording = async () => {
        await VoiceRecorder.startRecording();
        setIsRecording(true)
    }

    const stopRecording = async () => {
        const result: RecordingData = await VoiceRecorder.stopRecording()
        if (result.value && result.value.recordDataBase64) {
            const recordData = result.value.recordDataBase64;

            await Filesystem.writeFile({
                path: fileName,
                directory: Directory.Data,
                data: recordData,
            });
            loadFiles();
        }
        setIsRecording(false)
    }

    const playRecording = async () => {
        // files not playing on web browser, try on app
        const audioFile = await Filesystem.readFile({
            path: fileName,
            directory: Directory.Data,
        });
        const mimeType = 'audio/wav';
        const base64Sound = audioFile.data;

        const audioRef = new Audio(`data:${mimeType};base64,${base64Sound}`);
        audioRef.oncanplaythrough = () => audioRef.play();
        audioRef.load();
        setIsPlayingRecord(true)
        audioRef.addEventListener('ended', () => {
            setIsPlayingRecord(false)
        })
    }

    const addToFavourite = async () => {
        const firebaseUser = await getUser(user?.uid)
        if (firebaseUser) {
            const updatingFavouriteIds = [...favouriteIds, id]
            const updatingUser = {
                ...firebaseUser,
                favouriteIds: updatingFavouriteIds,
            }
            await setUser(user?.uid, updatingUser)
            setFavouriteIds(updatingFavouriteIds)
        }
    }

    const removeFromFavourite = async () => {
        const firebaseUser = await getUser(user?.uid)
        if (firebaseUser) {
            const updatingFavouriteIds = favouriteIds.filter((favId: string) => favId !== id)
            const updatingUser = {
                ...firebaseUser,
                favouriteIds: updatingFavouriteIds,
            }
            await setUser(user?.uid, updatingUser)
            setFavouriteIds(updatingFavouriteIds)
        }
    }

    useEffect(() => {
        loadFiles()
        VoiceRecorder.requestAudioRecordingPermission()
        getUserFavouriteSentenceIds(user?.uid).then(res => {
            setFavouriteIds(res)
        })
    }, [])

    useEffect(() => {
        setWords(words)
        setWord(words.find(wd => wd.id == id) || {})
    }, [words, id])

    const playAudio = async (filePath: string) => {
        // const file = Media.create(filePath)
        // console.log({ filePath });
        const audioDataRef = ref(storage, `${filePath}`)
        const url = await getDownloadURL(audioDataRef)
        // const file = new MediaObject(audio)
        // file.play();
        // const file = Media.create(url)
        const file = new Audio(url)
        file.play()
        file.addEventListener('ended', () => {
            setPlaying(false)
        })
        setPlaying(true)

        // file?.onError.subscribe((ob) => {
        //     switch(ob) {
        //         case 1:
        //             alert('Error: Aborted');
        //             break;
        //         case 2:
        //             alert('Network error');
        //             break;
        //         case 3:
        //             alert('Decode error');
        //             break;
        //         case 4:
        //             alert('Unsupported File');
        //             break;
        //         default:
        //             alert(`An error occurred`)
        //     }
        //     setPlaying(null)
        // })

        // file?.onStatusUpdate.subscribe((ob) => {
        //     switch(ob) {
        //         case 0:
        //             alert('No File');
        //             break;
        //         case 1:
        //             setPlaying(playing)
        //             break;
        //         case 2:
        //             setPlaying(playing)
        //             break;
        //         case 3:
        //             alert('Paused');
        //             break;
        //         case 4:
        //             setPlaying(null)
        //             break;
        //         default:
        //             setPlaying(null)
        //             break;
        //     }
        // })
        // file.play();

    }

    // const stopAudio = () => {
    //     if(file) {
    //         file.stop()
    //         setFile(null)
    //     };
    // }




// export declare enum MEDIA_STATUS {
//     NONE = 0,
//     STARTING = 1,
//     RUNNING = 2,
//     PAUSED = 3,
//     STOPPED = 4
// }
// export declare enum MEDIA_ERROR {
//     ABORTED = 1,
//     NETWORK = 2,
//     DECODE = 3,
//     SUPPORTED = 4
// }

    return (
        <AppContainer backButton={true}>
            <IonGrid style={{ padding: 0, margin: '-1rem ' }}>
                {Boolean(word?.id) && (
                    <div>
                        <div className='item'>
                            <p>{word.english}</p>

                            <IonButton color='light' fill='clear' >
                                {/* <IonIcon icon={playing == '1' ? pause : play} /> */}
                            </IonButton>
                        </div>

                        <div className='item'>
                            <p style={{ fontSize: 24, color: '#000' }}>
                                { word.dharug }
                            </p>

                            {word.dharugAudioUrl && (
                                <IonButton
                                    onClick={playing ? () => {} : () => playAudio(word.dharugAudioUrl)}
                                    fill='clear'
                                    slot='end'
                                    className='orange-btn'
                                >
                                    {/* <IonIcon icon={ playing == '2' ? pause : play } /> */}
                                    <IonIcon icon={playing ? pause : play} />
                                </IonButton>
                            )}
                        </div>

                        <IonGrid className="favourite-container">
                            <IonRow className="item">
                                <IonText class='normal'>
                                    <h2>Favourite</h2>
                                </IonText>
                            </IonRow>

                            <IonRow className="item">
                                <IonCol
                                    size="10"
                                    style={{
                                        paddingInlineStart: 'unset',
                                        paddingInlineEnd: 'unset',
                                        display: 'flex',
                                        alignItems: 'center',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    <IonText class='normal'>
                                        {addedToFavourite
                                            ? 'Added to favourite'
                                            : 'Click the star to add to your favourite list'
                                        }
                                    </IonText>
                                </IonCol>

                                <IonCol size="2">
                                    <IonButtons style={{ justifyContent: 'space-between' }}>
                                        <IonButton
                                            class='normal'
                                            fill="clear"
                                            shape="round"
                                            style={{
                                                width: 48,
                                                height: 48,
                                            }}
                                            onClick={addedToFavourite ? removeFromFavourite : addToFavourite}
                                        >
                                            <IonIcon
                                                icon={addedToFavourite ? star : starOutline}
                                                size="large"
                                                style={{ color: '#ffd602' }}
                                            />
                                        </IonButton>
                                    </IonButtons>
                                </IonCol>
                            </IonRow>
                        </IonGrid>

                        <IonGrid className="record-container">
                            <IonRow className="item">
                                <IonText class='normal'>
                                    <h2 >Record</h2>
                                </IonText>
                            </IonRow>

                            <IonRow className="item">
                                <IonCol
                                    size="8"
                                    style={{
                                        paddingInlineStart: 'unset',
                                        paddingInlineEnd: 'unset',
                                        display: 'flex',
                                        alignItems: 'center',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    <IonText class='normal'>
                                        {hasRecord
                                            ? fileName
                                            : 'There is no record yet'
                                        }
                                    </IonText>
                                </IonCol>

                                <IonCol size="4">
                                    <IonButtons style={{ justifyContent: 'space-between' }}>
                                        <IonButton
                                            class='normal'
                                            fill="outline"
                                            shape="round"
                                            style={{
                                                width: 48,
                                                height: 48,
                                            }}
                                            onClick={isRecording ? stopRecording : startRecording}
                                        >
                                            <IonIcon icon={isRecording ? stop : recording} size="large"/>
                                        </IonButton>

                                        <IonButton
                                            class='normal'
                                            fill="outline"
                                            shape="round"
                                            style={{
                                                width: 48,
                                                height: 48,
                                            }}
                                            disabled={!hasRecord}
                                            onClick={isPlayingRecord ? () => {} : playRecording}
                                        >
                                            <IonIcon icon={isPlayingRecord ? pause : play} size="large"/>
                                        </IonButton>
                                    </IonButtons>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </div>
                )}
            </IonGrid>
        </AppContainer>

    );
};

export default Play;
