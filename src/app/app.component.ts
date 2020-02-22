import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthProvider } from '../providers/auth/auth';
import { FeedbackProvider } from '../providers/feedback/feedback';
import { User } from '../models/user';
import { DataProvider } from '../providers/data/data';

import { STORAGE_KEY, NETWORK } from '../utils/consts';
import { IntroPage } from '../pages/intro/intro';
import { HomePage } from '../pages/home/home';
import { Network } from '@ionic-native/network';
import { NetworkErrorPage } from '../pages/network-error/network-error';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: any;
  profile: User;
  networkModal = this.modalCtrl.create(NetworkErrorPage);
  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public authProvider: AuthProvider,
    public dataProvider: DataProvider,
    public feebackProvider: FeedbackProvider,
    public ionEvents: Events,
    public modalCtrl: ModalController,
    public splashScreen: SplashScreen,
    private network: Network) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.statusBar.styleLightContent();
      const intro = this.dataProvider.getItemFromLocalStorage(STORAGE_KEY.intro);
      const a = Object.getOwnPropertyNames(intro).length;
      if (a === 0) {
        this.openIntroPage();
      }
      this.network.onchange().subscribe(connection => {
        if (connection.type.toLowerCase() === NETWORK.offline) {
          this.handleNetworkError();
        }
        else {
          this.dissmissNetworkErrorPage();
        }
      });

    });
  }

  dissmissNetworkErrorPage() {
    this.networkModal.dismiss();
  }

  handleNetworkError() {
    this.networkModal.onDidDismiss((data) => {
      console.log(data);
    });
    this.networkModal.present();
  }

  openIntroPage() {
    const modal = this.modalCtrl.create(IntroPage);
    modal.onDidDismiss(() => {
    });
    modal.present();
  }
}
