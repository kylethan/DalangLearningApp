import React, {useMemo} from 'react';
import { getBlob, getDownloadURL, ref } from 'firebase/storage';
import { useParams } from 'react-router';
import {
    IonButton,
    IonButtons,
    IonCol,
    IonGrid,
    IonIcon,
    IonItem,
    IonLabel,
    IonRow,
    IonText,
} from '@ionic/react';
import {
    ear,
    pause,
    play,
    stop,
    recording,
    volumeHigh,
} from 'ionicons/icons';
import { Media, MediaObject } from '@awesome-cordova-plugins/media';
import { useEffect, useState } from 'react';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import {
  VoiceRecorder,
  VoiceRecorderPlugin,
  RecordingData,
  GenericResponse,
  CurrentRecordingStatus,
} from 'capacitor-voice-recorder';

import { words, storage } from '../../api/handler';
import AppContainer from '../../components/AppContainer/AppContainer';
import './Play.css';

const Play: React.FC = () => {
    const { id } = useParams<{ id: string; }>();
    const [ wrds, setWords ] = useState<Array<any>>([])
    const [ word, setWord ] = useState<any>(null)
    const [ playing, setPlaying ] = useState<boolean>(false)
    const [ toPlay, setToPlay ] = useState<string | null>(null)
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
    console.log({ hasRecord });

    const loadFiles = async () => {
        const { files } = await Filesystem.readdir({
            path: '',
            directory: Directory.Data,
        })
        console.log({ files });
        setRecords(files)
    }

    const startRecording = async () => {
        await VoiceRecorder.startRecording();
        console.log('Starting');
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
        console.log('Play');
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

    useEffect(() => {
        loadFiles()
        VoiceRecorder.requestAudioRecordingPermission()
    }, [])

    useEffect(() => {
        setWords(words)
        setWord(words.find(wd => wd.id == id) || {})
    }, [words, id])

    const playAudio = async (filePath: string, playing: string) => {
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
                                    onClick={playing ? () => {} : () => playAudio(word.dharugAudioUrl, '2')}
                                    fill='clear'
                                    slot='end'
                                    className='orange-btn'
                                >
                                    {/* <IonIcon icon={ playing == '2' ? pause : play } /> */}
                                    <IonIcon icon={playing ? pause : play} />
                                </IonButton>
                            )}
                        </div>

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
