import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { PresenceService } from '../../providers/presence/presence';



@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public feedbackProvider: FeedbackProvider,
    public app: App,
    public presenceProvider: PresenceService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  async logout(){
    await this.presenceProvider.setPresence('offline');
    this.authProvider.logout().then(() => {
      this.app.getRootNav().setRoot(HomePage);
    }).catch(err => {
      this.feedbackProvider.presentAlert('Logout failed', 'Oopsie, this is rather odd. Please try again');
    });
  }
}
