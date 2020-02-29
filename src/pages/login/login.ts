import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { User } from '../../models/user';
import { NationalityPage } from '../nationality/nationality';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { AuthProvider } from '../../providers/auth/auth';
import { STORAGE_KEY, MESSAGES, COLLECTION, USER_NOT_FOUND, INVALID_PASSWORD } from '../../utils/consts';
import { LocationProvider } from '../../providers/location/location';
import { TabsPage } from '../tabs/tabs';
import { FirebaseApiProvider } from '../../providers/firebase-api/firebase-api';
import { DataProvider } from '../../providers/data/data';
import { take } from 'rxjs/operators';
import firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginType: string = '';
  data = {
    email: '',
    password: '',
    otpCode: '',
    phonenumber: '',
    phone: {
      flag: "🇿🇦",
      code: "+27",
      number: ''
    },
    location: { address: '' }
  }
  type = 'password';
  showPass = false;
  showOTPPage = false;
  verificationId: string = '';

  // user: any;
  applicationVerifier: any;
  windowRef: any;
  verificationCode: string;
  countries: any = [];
  users: User[] = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public feedbackProvider: FeedbackProvider,
    public authProvider: AuthProvider,
    public firebaseApiProvider: FirebaseApiProvider,
    public locationProvider: LocationProvider,
    public dataProvider: DataProvider,
    public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.loginType = this.navParams.get('loginType');
  }

  loginWithPhoneNumber() {
    console.log('loginWithPhoneNumber');
  }


  loginWithEmailAndPassword() {
    this.feedbackProvider.presentLoading();
    this.authProvider.signInWithEmailAndPassword(this.data.email, this.data.password).then(res => {
      const isVerified = res.user.emailVerified;
      this.firebaseApiProvider.getItem(COLLECTION.users, res.user.uid).then(snap => {
        this.feedbackProvider.dismissLoading();
        const user = snap.val();
        user.verified = isVerified;
        this.navigate(user);
      }).catch(err => {
        this.feedbackProvider.dismissLoading();
        this.feedbackProvider.presentToast(MESSAGES.oops);
      });
    }).catch(err => {
      this.feedbackProvider.dismissLoading();
      if (err.code === USER_NOT_FOUND || err.code == INVALID_PASSWORD) {
        this.feedbackProvider.presentErrorAlert(MESSAGES.loginFailed, MESSAGES.emailNotRegistered);
      }
    });
  }



  handleLocationError(user: User) {
    const confirm = this.alertCtrl.create({
      title: 'Location error',
      message: 'Ooops, we could not get your current location, please allow access to your location',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navigate(user);
          }
        }
      ]
    });
    confirm.present();
  }

  navigate(user: User) {
    this.dataProvider.addItemToLocalStorage(STORAGE_KEY.user, user);
    this.navCtrl.setRoot(TabsPage, { user });
  }


  // getUserLocation(user: User) {
  //   this.feedbackProvider.presentLoading('Getting location...');
  //   this.locationProvider.getLocation().then(res => {
  //     this.feedbackProvider.dismissLoading();
  //     const loc = {
  //       lat: res.coords.latitude,
  //       lng: res.coords.longitude
  //     }
  //     user.location.geo = loc;
  //     this.firebaseApiProvider.addItemToLocalStorage(STORAGE_KEY.user, user);
  //     this.ionEvents.publish(EVENTS.loggedIn, user);
  //     this.navCtrl.setRoot(TabsPage, { user });
  //   }).catch(err => {
  //     this.feedbackProvider.dismissLoading();
  //     this.feedbackProvider.presentAlert('Oopise', 'Somwthing went wrong please try again');
  //   });
  // }

  // navigate(user: User) {
  //   this.feedbackProvider.presentLoading('Getting location...');
  //   this.locationProvider.getLocation().then(res => {
  //     this.feedbackProvider.dismissLoading();
  //     const loc = {
  //       lat: res.coords.latitude,
  //       lng: res.coords.longitude
  //     }
  //     user.location.geo = loc;
  //     this.updateUserLocation(user);
  //     this.ionEvents.publish(EVENTS.loggedIn, user);
  //     this.dataProvider.addItemToLocalStorage(STORAGE_KEY.user, user);
  //     this.navCtrl.setRoot(TabsPage, { user });
  //   }).catch(err => {
  //     this.feedbackProvider.dismissLoading();
  //     this.feedbackProvider.presentAlert('Oopise', 'Somwthing went wrong please try again');
  //   });
  // }

  // updateUserLocation(user) {
  //   this.feedbackProvider.presentLoading();
  //   this.dataProvider.updateCollection(COLLECTION.users, user, user.uid).then(() => {
  //     console.log('Location updated');
  //     this.feedbackProvider.dismissLoading();
  //   }).catch(err => {
  //     this.feedbackProvider.dismissLoading();
  //     console.log('Location update failed');
  //   });
  // }

  showPassword() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  getCountryCode() {
    let modal = this.modalCtrl.create(NationalityPage);
    modal.onDidDismiss(data => {
      if (data) {
        this.data.phone.number = data.number;
        this.data.phone.code = data.dial_code;
        this.data.phone.flag = data.flag;
      }
    });
    modal.present();
  }
}
