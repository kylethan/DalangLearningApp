import React from 'react';
import './Play.css';
import AppContainer from '../../components/AppContainer/AppContainer';
import { useParams } from 'react-router';
import { IonButton, IonButtons, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonRow, IonText } from '@ionic/react';
import { ear, pause, play, volumeHigh } from 'ionicons/icons';
import { Media, MediaObject } from '@awesome-cordova-plugins/media/index';
import { useEffect, useState } from 'react';
import { words } from '../../api/handler';

const Play: React.FC = () => {
    const { id } = useParams<{ id: string; }>();
    const [ wrds, setWords ] = useState<Array<any>>([])
    const [ word, setWord ] = useState<any>({})
    const [ playing, setPlaying ] = useState<string | null>(null)
    const [ toPlay, setToPlay ] = useState<string | null>(null)

    useEffect(() => {
        setWords(words)
        setWord(words.find(wd => wd.id == id) || {})
    }, [words, id])

    const playAudio = (filePath: string, playing: string) => {
        const file = Media.create(filePath)
        setPlaying(playing)

        file?.onError.subscribe((ob) => {
            switch(ob) {
                case 1:
                    alert('Error: Aborted');
                    break;
                case 2:
                    alert('Network error');
                    break;
                case 3:
                    alert('Decode error');
                    break;
                case 4:
                    alert('Unsupported File');
                    break;
                default:
                    alert(`An error occurred`)
            }
            setPlaying(null)
        })

        file?.onStatusUpdate.subscribe((ob) => {
            switch(ob) {
                case 0:
                    alert('No File');
                    break;
                case 1:
                    setPlaying(playing)
                    break;
                case 2:
                    setPlaying(playing)
                    break;
                case 3:
                    alert('Paused');
                    break;
                case 4:
                    setPlaying(null)
                    break;
                default:
                    setPlaying(null)
                    break;
            }
        })
        file.play();

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
                {
                    Boolean(word?.id) &&
                    <div>
                        <div className='item'>
                            <p>
                                { word.english }
                            </p>
                            <IonButton color='light' fill='clear' >
                                {/* <IonIcon icon={playing == '1' ? pause : play} /> */}
                            </IonButton>
                        </div>
                        <div className='item'>
                            <p style={{ fontSize: 24, color: '#000' }}>
                                { word.dharug }
                            </p>
                            <IonButton onClick={() => playAudio(word.dharugAudioUrl, '2')} fill='clear' slot='end' className='orange-btn'>
                                <IonIcon icon={ playing == '2' ? pause : play } />
                            </IonButton>
                        </div>
                    </div>
                }
            </IonGrid>
        </AppContainer>

    );
};

export default Play;
