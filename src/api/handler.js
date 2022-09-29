import app from "./config";
import data from '../data2.json'
import {
    collection,
    addDoc,
    getFirestore,
    updateDoc,
    getDocs,
    getDoc,
    doc,
    setDoc,
    deleteDoc,
} from "firebase/firestore";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth();

export let words = [];
export let userInfo = {};

export const setUserInfo = (val) => userInfo = val;

export const setUpDb  = async () => {
    return new Promise((resolve, reject) => {
        let count = 0;
        try {
            data.map(async ({ english_audio_path, dharug_audio_path, ...datum}) => {
                const docRef = await addDoc(collection(db, "wordList"), datum);

                await fetch(`../assets/${english_audio_path}`).then(resp => resp.blob())
                .then(async (blob) => {
                    const fileReader = new FileReader();
                    fileReader.readAsArrayBuffer(blob)
                    fileReader.onload = async function (e) {
                        const file = e.target.result;
                        const englishRef = ref(storage, `audios/${docRef.id}/english.mp3`);
                        const englishTask = await uploadBytes(englishRef, file);
                        const englishAudioUrl = await getDownloadURL(englishRef)

                        await fetch(`../assets/${dharug_audio_path}`).then(resp => resp.blob())
                        .then(async (blob) => {
                            const fileReader = new FileReader();
                            fileReader.readAsArrayBuffer(blob)
                            fileReader.onload = async function (e) {
                                const file = e.target.result;
                                const dharugRef = ref(storage, `audios/${docRef.id}/dharug.mp3`);
                                const dharugTask = await uploadBytes(dharugRef, file);
                                const dharugAudioUrl = await getDownloadURL(dharugRef)

                                await updateDoc(docRef, {
                                    englishAudioUrl,
                                    dharugAudioUrl,
                                    docId: docRef.id
                                });
                                count += 1;
                                console.log(count, data.length)
                                if(count === data.length) {
                                    console.log('completed')
                                    resolve('finished')
                                };
                            };
                        });
                    };
                });
            })
        }
        catch(err) {
            reject(err)
        }
    })

}

export const getWords = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const docRef = collection(db, "wordList");
            const docSnap = await getDocs(docRef);
            words = docSnap.docs.map(doc => doc.data());
            resolve(words);
        }
        catch(err) {
            reject(err)
        }
    })
}

export const getCategories = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const docRef = collection(db, "categories");
            const docSnap = await getDocs(docRef);
            const categories = docSnap.docs.map(doc => doc.data());
            resolve(categories);
        }
        catch(err) {
            reject(err)
        }
    })
}

export const loginUser = async (email = '', password = '') => {
    return new Promise(async (resolve, reject) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user;
            const userData = await getUser(user.uid);
            userInfo = userData
            resolve(userData);
        }
        catch(err) {
            reject(err)
        }
    })
}

export const registerUser = async (email = '', password = '', username = '') => {
    return new Promise(async (resolve, reject) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user;
            await setUser(user.uid, { email, username })
            resolve({ email, username });
        }
        catch(err) {
            reject(err)
        }
    })
}

export const getUser = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const docRef = doc(db, "users", userId);
            const docSnap = await getDoc(docRef);
            const user = docSnap.data()
            resolve(user);
        }
        catch(err) {
            reject(err)
        }
    })
}

export const setUser = async (userId, payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updatingUser = {
                ...payload,
                uid: userId,
            }
            await setDoc(doc(db, 'users', userId), updatingUser);
            resolve(updatingUser);
        }
        catch(err) {
            reject(err)
        }
    })
}

export const addWord  = async (payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { englishAudioFile, dharugAudioFile, ...datum } = payload;

            const docRef = await addDoc(collection(db, "words"), datum);

            if(englishAudioFile) {
                const englishRef = ref(storage, `audios/${docRef.id}/english.mp3`);
                const englishTask = await uploadBytes(englishRef, englishAudioFile);
                const englishAudioUrl = await getDownloadURL(englishRef)
                await updateDoc(docRef, {
                    englishAudioUrl,
                    docId: docRef.id
                });
            }

            if(dharugAudioFile) {
                const dharugRef = ref(storage, `audios/${docRef.id}/dharug.mp3`);
                const dharugTask = await uploadBytes(dharugRef, dharugAudioFile);
                const dharugAudioUrl = await getDownloadURL(dharugRef)
                await updateDoc(docRef, {
                    dharugAudioUrl,
                    docId: docRef.id
                });
            }

            resolve('finished')
        }
        catch(err) {
            reject(err)
        }
    })

}

export const updateWord  = async (payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { englishAudioFile, dharugAudioFile, docId, ...datum } = payload;

            if(docId) {
                await updateDoc(doc(db, 'words', docId), { ...datum });

                if(englishAudioFile) {
                    const englishRef = ref(storage, `audios/${docId}/english.mp3`);
                    const englishTask = await uploadBytes(englishRef, englishAudioFile);
                    const englishAudioUrl = await getDownloadURL(englishRef)
                    await updateDoc(doc(db, 'words', docId), {
                        englishAudioUrl
                    });
                }

                if(dharugAudioFile) {
                    const dharugRef = ref(storage, `audios/${docId}/dharug.mp3`);
                    const dharugTask = await uploadBytes(dharugRef, dharugAudioFile);
                    const dharugAudioUrl = await getDownloadURL(dharugRef)
                    await updateDoc(doc(db, 'words', docId), {
                        dharugAudioUrl
                    });
                }
            }
            resolve('finished')

        }
        catch(err) {
            reject(err)
        }
    })

}

export const deleteWord  = async (docId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(docId) {
                await deleteDoc(doc(db, "words", docId));

                const englishRef = ref(storage, `audios/${docId}/english.mp3`);
                const dharugRef = ref(storage, `audios/${docId}/dharug.mp3`);

                // Delete the file
                await deleteObject(englishRef)
                await deleteObject(dharugRef)
            }
            resolve('finished')

        }
        catch(err) {
            reject(err)
        }
    })
}

export const getDefaultConversations = async () => {
    try {
        const collectionRef = collection(db, 'defaultConversations');
        const collectionSnap = await getDocs(collectionRef);
        const conversations = collectionSnap.docs.map(doc => doc.data());
        return conversations;
    } catch(err) {
        console.error({ getDefaultConversations: err });
        throw err
    }
}

export const getUserConversations = async (userId) => {
    try {
        const collectionRef = collection(db, 'users', userId, 'conversations');
        const collectionSnap = await getDocs(collectionRef);
        const conversations = collectionSnap.docs.map(doc => doc.data());
        return conversations;
    } catch(err) {
        console.error({ getUserConversations: err });
        throw err
    }
}

export const getUserConversation = async (userId, conversationId) => {
    try {
        const docRef = doc(db, 'users', userId, 'conversations', conversationId);
        const docSnap = await getDoc(docRef);
        return docSnap.data();
    } catch(err) {
        console.error({ getUserConversation: err });
        throw err
    }
}

export const addUserConversation = async (userId, conversation) => {
    try {
        await addDoc(collection(db, 'users', userId, 'conversations'), conversation)
    } catch (err) {
        console.error({ addUserConversation: err });
        throw err
    }
}

export const deleteUserConversation = async (userId, conversationId) => {
    try {
        await deleteDoc(doc(db, 'users', userId, 'conversations', conversationId))
    } catch (err) {
        console.error({ deleteUserConversation: err });
        throw err
    }
}
