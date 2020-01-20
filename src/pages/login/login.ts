import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { Country } from '../../models/country';
import { User } from '../../models/user';
import { NationalityPage } from '../nationality/nationality';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { AuthProvider } from '../../providers/auth/auth';
import { DataProvider } from '../../providers/data/data';
import { take } from 'rxjs/operators';
import { STORAGE_KEY, USER_NOT_FOUND, MESSAGES, INVALID_PASSWORD, USER_TYPE, EVENTS, COLLECTION } from '../../utils/consts';
import { DashboardPage } from '../dashboard/dashboard';
import { SellersPage } from '../sellers/sellers';
import { LocationProvider } from '../../providers/location/location';
 

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
    public dataProvider: DataProvider,
    public ionEvents: Events,
    public locationProvider: LocationProvider) {
  }

  ionViewDidLoad() {
    this.loginType = this.navParams.get('loginType');
    console.log(this.loginType);
  }

  loginWithPhoneNumber() {
    console.log('loginWithPhoneNumber');
  }

  loginWithEmailAndPassword() {
    this.feedbackProvider.presentLoading();
    this.authProvider.signInWithEmailAndPassword(this.data.email, this.data.password).then(res => {
      this.dataProvider.getUserById(res.user.uid).pipe(take(1)).subscribe(user => {
        this.feedbackProvider.dismissLoading();
        const isVerified = this.authProvider.isUserVerified();
        this.dataProvider.addItemToLocalStorage(STORAGE_KEY.verified, isVerified);
        this.navigate(user);
      }, err => {
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

  navigate(user: User) {
    this.feedbackProvider.presentLoading('Getting location...');
    this.locationProvider.getLocation().then(res => {
      this.feedbackProvider.dismissLoading();
      const loc = {
        lat: res.coords.latitude,
        lng: res.coords.longitude
      }
      console.log('New Location: ', res);
      console.log('User: ', user);

      user.location.geo = loc; 
      this.updateUserLocation(user);
      this.ionEvents.publish(EVENTS.loggedIn, user);
      this.dataProvider.addItemToLocalStorage(STORAGE_KEY.user, user);
      user.userType === USER_TYPE.seller ? this.navCtrl.setRoot(DashboardPage) : this.navCtrl.setRoot(SellersPage);
    }).catch(err => {
      this.feedbackProvider.dismissLoading();
      user.userType === USER_TYPE.seller ? this.navCtrl.setRoot(DashboardPage) : this.navCtrl.setRoot(SellersPage);
    });
  }

  updateUserLocation(user) {
    this.feedbackProvider.presentLoading();
    this.dataProvider.updateCollection(COLLECTION.users, user, user.uid).then(() => {
      console.log('Location updated');
      this.feedbackProvider.dismissLoading();
    }).catch(err => {
      this.feedbackProvider.dismissLoading();
      console.log('Location update failed');
    });
  }

  cancelLogin() {
    this.navCtrl.pop();
  }

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
