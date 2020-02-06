import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
 
import { UsersPage } from '../pages/users/users';
import { RequestsPage } from '../pages/requests/requests';
import { ProfilePage } from '../pages/profile/profile';
import { AuthProvider } from '../providers/auth/auth';
import { FeedbackProvider } from '../providers/feedback/feedback';
import { MESSAGES, USER_TYPE } from '../utils/consts';
import { User } from '../models/user';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { ViewedPage } from '../pages/viewed/viewed';
import { RatedPage } from '../pages/rated/rated';
import { ChatsPage } from '../pages/chats/chats';
import { DataProvider } from '../providers/data/data';

import { EVENTS, STORAGE_KEY } from '../utils/consts';
import { IntroPage } from '../pages/intro/intro';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { VisitorPage } from '../pages/visitor/visitor';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = VisitorPage;

  pages: any;
  profile: User;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public authProvider: AuthProvider,
    public dataProvider: DataProvider,
    public feebackProvider: FeedbackProvider,
    public ionEvents: Events,
    public modalCtrl: ModalController,
    public splashScreen: SplashScreen) {
      this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.statusBar.styleLightContent();
      const intro = this.dataProvider.getItemFromLocalStorage(STORAGE_KEY.intro);
      const a = Object.getOwnPropertyNames(intro).length;
      if (a === 0)
        this.openIntroPage();
    });
  }

  openIntroPage() {
    const modal = this.modalCtrl.create(IntroPage);
    modal.onDidDismiss(() => {
    });
    modal.present();
  }  
}
