import React from 'react';
import { useLocation } from 'react-router-dom';
import {
    IonAvatar,
    IonButton,
    IonCol,
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonRow,
} from '@ionic/react';
import {
    bookmarkOutline,
    chatbubbleOutline,
    chatbubblesOutline,
    mailOutline,
} from 'ionicons/icons';

import { useAuth } from '../../hooks/useAuth';
import './Menu.css';

const defaultIconUrl = 'https://cdn-icons-png.flaticon.com/128/149/149071.png';

interface AppPage {
    url: string;
    iosIcon: string;
    mdIcon: string;
    title: string;
    show?: boolean;
}

const Menu: React.FC = () => {
    const location = useLocation();
    const { user, signOut } = useAuth()

    const appPages: AppPage[] = [
        {
            title: 'Sentences',
            url: '/categories',
            iosIcon: mailOutline,
            mdIcon: mailOutline
        },
        {
            title: 'Conversations',
            url: '/conversations',
            iosIcon: chatbubblesOutline,
            mdIcon: chatbubbleOutline
        },
        {
            title: 'Favourites',
            url: '/favourites',
            iosIcon: bookmarkOutline,
            mdIcon: bookmarkOutline
        },
        // {
        //     title: 'Admin',
        //     url: '/admin',
        //     iosIcon: personOutline,
        //     mdIcon: personOutline,
        //     show: Boolean(user?.admin)
        // },
    ];

    const getRoute = () => {
        return Boolean(location.pathname.includes('login') || location.pathname.includes('register'))
    }

    return (
        <IonMenu contentId="main" type="overlay" className='menu' disabled={getRoute()}>
            <IonContent>
                <IonList>
                    <div className='head'>
                        <IonListHeader>
                            <IonRow className="user-info-container">
                                <IonAvatar className="user-avatar">
                                    <img
                                        alt="user-avatar"
                                        src={user?.photoURL || defaultIconUrl}
                                    />
                                </IonAvatar>

                                <IonCol>
                                    <IonLabel>
                                        {user?.displayName || user?.email || user?.phoneNumber || ''}
                                    </IonLabel>

                                    <IonButton
                                        shape="round"
                                        color="tertiary"
                                        size="small"
                                        fill="solid"
                                        onClick={signOut}
                                    >
                                        Sign out
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        </IonListHeader>
                    </div>

                    {appPages.filter(({ show = true }) => Boolean(show)).map(({ show = true, ...appPage }, index) => (
                        <IonMenuToggle key={index} autoHide={false}>
                            <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                                <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />

                                <IonLabel>{appPage.title}</IonLabel>
                            </IonItem>
                        </IonMenuToggle>
                    ))}

                    {/* <IonMenuToggle autoHide={false} className='btm'>
                        <IonItem onClick={() => { setUserInfo({}) }} routerLink={'/'} routerDirection="none" lines="none" detail={false}>
                            <IonIcon slot="start" icon={logOutOutline} />
                            <IonLabel>Logout</IonLabel>
                        </IonItem>
                    </IonMenuToggle> */}
                </IonList>
            </IonContent>
        </IonMenu>
    );
};

export default Menu;
