import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ModalController, ActionSheetController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { ChangePasswordPage } from '../change-password/change-password';
import { FirebaseApiProvider } from '../../providers/firebase-api/firebase-api';
import { User } from '../../models/user';
import { TermsPage } from '../terms/terms';
import { ReportBugPage } from '../report-bug/report-bug';



@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  profile: User;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public feedbackProvider: FeedbackProvider,
    public firebaseApiProvider: FirebaseApiProvider,
    public app: App,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    this.profile = this.firebaseApiProvider.getLoggedInUser();
  }

  changePassword() {
    let changePasswordModal = this.modalCtrl.create(ChangePasswordPage, { profile: this.profile });
    changePasswordModal.onDidDismiss((data) => {
      console.log(data);
    });
    changePasswordModal.present();
  }

  deactivateAccout() {
    console.log('Deactivate account');
  }

  presentDeactivateAccountActionsheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Are you sure you want to deactivate your account?',
      buttons: [
        {
          text: 'Yes, deactivate',
          role: 'destructive',
          handler: () => {
            this.deactivateAccout();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  reportBug() {
    let reportBugModal = this.modalCtrl.create(ReportBugPage, { profile: this.profile });
    reportBugModal.onDidDismiss((data) => {
      console.log(data);
    });
    reportBugModal.present();
  }

  showTermsAndConditions() {
    this.navCtrl.push(TermsPage);
  }

  logout() {
    this.authProvider.logout().then(() => {
      this.app.getRootNav().setRoot(HomePage);
    }).catch(err => {
      this.feedbackProvider.presentAlert('Logout failed', 'Oopsie, this is rather odd. Please try again');
    });
  }
}
