import React from 'react';
import { getBlob, getDownloadURL, ref } from 'firebase/storage';

import AppContainer from '../../components/AppContainer/AppContainer';
import { useParams } from 'react-router';
import { IonButton, IonButtons, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonRow, IonText } from '@ionic/react';
import { ear, pause, play, volumeHigh } from 'ionicons/icons';
import { Media, MediaObject } from '@awesome-cordova-plugins/media';
import { useEffect, useState } from 'react';
import { words, storage } from '../../api/handler';
import './Play.css';

const Play: React.FC = () => {
    const { id } = useParams<{ id: string; }>();
    const [ wrds, setWords ] = useState<Array<any>>([])
    const [ word, setWord ] = useState<any>({})
    const [ playing, setPlaying ] = useState<boolean>(false)
    const [ toPlay, setToPlay ] = useState<string | null>(null)

    useEffect(() => {
        setWords(words)
        setWord(words.find(wd => wd.id == id) || {})
    }, [words, id])

    const playAudio = async (filePath: string, playing: string) => {
        // const file = Media.create(filePath)
        // console.log({ filePath });
        const audioDataRef = ref(storage, `audio_data/${filePath}`)
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
                                <IonButton onClick={() => playAudio(word.dharugAudioUrl, '2')} fill='clear' slot='end' className='orange-btn'>
                                    {/* <IonIcon icon={ playing == '2' ? pause : play } /> */}
                                    <IonIcon icon={playing ? pause : play} />
                                </IonButton>
                            )}
                        </div>
                    </div>
                )}
            </IonGrid>
        </AppContainer>

    );
};

export default Play;
