import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Country } from '../../models/country';
import { User } from '../../models/user';
import { NationalityPage } from '../nationality/nationality';
import { SetupPage } from '../setup/setup';
import { DataProvider } from '../../providers/data/data';
import { AuthProvider } from '../../providers/auth/auth';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { EMAIL_EXISTS, MESSAGES } from '../../utils/consts';
 

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  signupType: string = '';

  emailSignup = {
    nickname: '',
    email: '',
    password: '',
    uid: ''
  }

  phoneSignup = {
    nickname: '',
    otpCode: '',
    phonenumber: '',
    phone: {
      flag: "🇿🇦",
      code: "+27",
      number: ''
    }
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
    private dataProvider: DataProvider,
    private authProvider: AuthProvider,
    public feedbackProvider: FeedbackProvider) {
  }

  ionViewDidLoad() {
    this.signupType =  this.navParams.get('signupType'); // 'emailAddress'//
    console.log(this.signupType);
  }

  signupWithPhoneNumber() {
    console.log(this.phoneSignup);
  }

  signupWithEmailAndPassword() {
    this.feedbackProvider.presentLoading();
    this.authProvider.signUpWithEmailAndPassword(this.emailSignup.email, this.emailSignup.password).then((u) => {
      this.emailSignup.uid = u.user.uid
      this.navCtrl.push(SetupPage, {data: this.emailSignup});
      this.feedbackProvider.dismissLoading();
    }).catch(err => {
      this.feedbackProvider.dismissLoading();
      if(err.code === EMAIL_EXISTS) {
        this.feedbackProvider.presentAlert(MESSAGES.signupFailed, MESSAGES.emailAlreadyRegistered);
      } 
    });
  }

  cancelSignup() {
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
        this.phoneSignup.phone.number = data.number;
        this.phoneSignup.phone.code = data.dial_code;
        this.phoneSignup.phone.flag = data.flag;
      }
    });
    modal.present();
  }
}
