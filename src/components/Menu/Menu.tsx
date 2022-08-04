import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { archiveOutline, archiveSharp, bookmarkOutline, chatbubbleOutline, chatbubblesOutline, heartOutline, heartSharp, logOutOutline, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, personOutline, personSharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
import './Menu.css';
import { userInfo, setUserInfo } from '../../api/handler';

interface AppPage {
    url: string;
    iosIcon: string;
    mdIcon: string;
    title: string;
    show?: boolean;
}



const Menu: React.FC = () => {
    const location = useLocation();
    const [ user, setUser ] = useState<any>({})
    useEffect(() => {
        setUser(userInfo)
    }, [userInfo])

    const appPages: AppPage[] = [
        {
            title: 'Sentences',
            url: '/categories',
            iosIcon: mailOutline,
            mdIcon: mailOutline
        },
        {
            title: 'Conversations',
            url: '/categories',
            iosIcon: chatbubblesOutline,
            mdIcon: chatbubbleOutline
        },
        {
            title: 'Favourites',
            url: '/categories',
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
                        <IonListHeader>{user?.username || ''}</IonListHeader>
                        <IonNote>{user?.email || ''}</IonNote>
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
