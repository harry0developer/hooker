import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular'
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { TermsPage } from '../terms/terms';
import { DataProvider } from '../../providers/data/data';
import { COLLECTION, USER_TYPE } from '../../utils/consts';
import { User } from '../../models/user';
import { AuthProvider } from '../../providers/auth/auth';
import { DashboardPage } from '../dashboard/dashboard';
import { SellersPage } from '../sellers/sellers';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  readTCsAndCs: boolean = true;
  constructor(
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public navParams: NavParams,
    public dataProvider: DataProvider,
    public authProvider: AuthProvider) {
  }
   
  ionViewDidLoad() {
    const storedUser = this.authProvider.getStoredUser();
    if (storedUser && storedUser.uid) {
      this.navigate(storedUser);
    }
  } 

  addUser() {
    const data: User = { 
      nickname: 'Big Cox',
      gender: 'male',
      age: '22',
      race: 'white', 
      bodyType: 'fat',
      height: '165',
      email: 'cox@test.com',
      phone: '+27820000000',
      password: '123456',
      uid: '',
      dateCreated: this.dataProvider.getDateTime(),
      userType: 'buyer',
      location: {
        address: '',
        geo: {
          lat: 0,
          lng: 0
        }
      }
    }
    this.authProvider.signUpWithEmailAndPassword(data.email, data.password).then(u => {
      data.uid = u.user.uid;
      this.dataProvider.addNewItemWithId(COLLECTION.users, data, data.uid).then(() => {
        console.log('User added succesfully');
      }).catch(err => {
        console.log('ERROR occured', err);
      });
    }).catch(err => {
      console.log('Signup err', err);
    });
  }

  navigate(user: User) {
    this.navCtrl.setRoot(TabsPage, {userType: user.userType})
  }

  loginWithEmailAddress() {
    this.navCtrl.push(LoginPage, {loginType: 'emailAddress'});
  }

  loginWithPhoneNumber() {
    this.navCtrl.push(LoginPage, {loginType: 'phoneNumber'});
  }

  signupWithEmailAddress() {
    this.navCtrl.push(SignupPage, {signupType: 'emailAddress'});
  }

  signupWithPhoneNumber() {
    this.navCtrl.push(SignupPage, {signupType: 'phoneNumber'});
  }

  presentLoginActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Login with',
      buttons: [
        {
          text: 'Phone number',
          icon: 'call',
          handler: () => {
            this.loginWithPhoneNumber();
          }
        },
        {
          text: 'Email address',
          icon: 'mail',
          handler: () => {
            this.loginWithEmailAddress();
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

  presentSignupActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Signup with',
      buttons: [
        {
          text: 'Phone number',
          icon: 'call',
          handler: () => {
            this.signupWithPhoneNumber();
          }
        },
        {
          text: 'Email address',
          icon: 'mail',
          handler: () => {
            this.signupWithEmailAddress();
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

  showTermsAndConditions() {
    this.navCtrl.push(TermsPage);
  }

  getStatus(e) {
    this.readTCsAndCs = e.checked;
  }
}
