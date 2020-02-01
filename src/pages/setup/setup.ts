import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { PlacesPage } from '../places/places';
import { DataProvider } from '../../providers/data/data';
import { COLLECTION, USER_TYPE, STORAGE_KEY, EMAIL_EXISTS, MESSAGES } from '../../utils/consts';
import { User } from '../../models/user';
import { Slides } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { SellersPage } from '../sellers/sellers';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { FirebaseAuthProvider } from '../../providers/firebase-auth/firebase-auth';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-setup',
  templateUrl: 'setup.html',
})
export class SetupPage {

  @ViewChild(Slides) slides: Slides;

  loc: string;
  data: User = { 
    nickname: '',
    gender: '',
    age: 0,
    race: '', 
    bodyType: '',
    height: 0,
    email: '',
    phone: '',
    password: '',
    uid: '',
    dateCreated: '',
    userType: '',
    location: {
      address: '',
      geo: {
        lat: 0,
        lng: 0
      }
    }
  }

  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController, 
    public navParams: NavParams,
    public dataProvider: DataProvider, 
    public feedbackProvider: FeedbackProvider,
    public firebaseAuthProvider: FirebaseAuthProvider) {
  }

  ionViewDidLoad() {
    this.slides.lockSwipes(true);
    const data: User = this.navParams.get('data');
    if(data) {
      if(data.nickname && data.email ) { //email signup
        this.data.nickname = data.nickname;
        this.data.email = data.email;
        this.data.password = data.password,
        this.data.uid = data.uid;
      } else { //phone signup
        this.data.nickname = data.nickname;
        this.data.phone = data.phone;
        this.data.uid = data.uid;
      }
    } else {
      console.log('Cannot be here');
    }
  }
 
  completeSignup() {
    this.feedbackProvider.presentLoading();
    this.firebaseAuthProvider.signupWithEmailAndPassword(this.data.email, this.data.password).then((u) => {
      this.data.uid = u.user.uid
      this.data.dateCreated = this.dataProvider.getDateTime();
      this.firebaseAuthProvider.setUserDoc(this.data.uid, this.data).then(() => {
        this.feedbackProvider.dismissLoading();
        this.navCtrl.setRoot(TabsPage, {user: this.data});
      }).catch(err => {
        this.feedbackProvider.dismissLoading();
        this.feedbackProvider.presentAlert(MESSAGES.signupFailed, 'Oops something went wrong, please try again');
      })
    }).catch(err => {
      this.feedbackProvider.dismissLoading();
      if(err.code === EMAIL_EXISTS) {
        this.feedbackProvider.presentAlert(MESSAGES.signupFailed, MESSAGES.emailAlreadyRegistered);
      } 
    });
  }


  navigate() {
    this.dataProvider.addItemToLocalStorage(STORAGE_KEY.user, this.data);
    if(this.data.userType === USER_TYPE.seller) {
      this.navCtrl.setRoot(DashboardPage);
    } else {
      this.navCtrl.setRoot(SellersPage);
    }
  }

  nextSlide() {
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  previousSlide() {
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }

  isFirstSlide(): boolean {
    return this.slides.isBeginning();
  }

  isLastSlide(): boolean {
    return this.slides.isEnd();
  }

  getSlideNumber(): string {
    return `${this.slides.getActiveIndex()} of 6`;
  }
 
  showAddressModal() {
    let modal = this.modalCtrl.create(PlacesPage);
    modal.onDidDismiss(data => {
      if (data) {
        this.loc = data.address;
        this.data.location = data;
      }
    });
    modal.present();
  }
}
