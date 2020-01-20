import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { PlacesPage } from '../places/places';
import { DataProvider } from '../../providers/data/data';
import { COLLECTION, USER_TYPE, STORAGE_KEY } from '../../utils/consts';
import { User } from '../../models/user';
import { Slides } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { SellersPage } from '../sellers/sellers';
import { FeedbackProvider } from '../../providers/feedback/feedback';

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
    age: '',
    race: '', 
    bodyType: '',
    height: '',
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
    public feedbackProvider: FeedbackProvider) {
  }

  ionViewDidLoad() {
    this.slides.lockSwipes(true);
    const data = this.navParams.get('data');
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
    this.data.dateCreated = this.dataProvider.getDateTime();
    this.dataProvider.addNewItem(COLLECTION.users, this.data).then(res => {
      this.feedbackProvider.presentLoading();
      this.navigate();
    }).catch(err => {
      this.feedbackProvider.presentLoading();
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
