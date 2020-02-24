import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { ChatPage } from '../chat/chat';
import { RateUserPage } from '../rate-user/rate-user';
import { COLLECTION, MESSAGES } from '../../utils/consts';
import { Ratings } from '../../models/ratings';
import { Observable } from 'rxjs';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { User } from '../../models/user';
import { UserLocation } from '../../models/location';
import { AuthProvider } from '../../providers/auth/auth';
import { FirebaseApiProvider } from '../../providers/firebase-api/firebase-api';

@IonicPage()
@Component({
  selector: 'page-seller-details',
  templateUrl: 'seller-details.html',
})
export class SellerDetailsPage {
  profile: User;
  user: User;
  img: string = "";
  category: string = 'info';
  openMenu: boolean = false;
  userRating = 0.0;
  allRatings: any[] = [];
  isLoading: boolean = false;
  allRatingsSubscription$: Observable<any>;
  locationAllowed: boolean;
  locationAccess: {
    allowed: boolean,
    msg: string;
  };
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public feedbackProvider: FeedbackProvider,
    public firebaseApiProvider: FirebaseApiProvider,
    public dataProvider: DataProvider,
    public authProvider: AuthProvider) {
  }

  ionViewDidLoad() {
    // this.profile = this.authProvider.getStoredUser();
    this.locationAccess = {
      allowed: this.profile.location && this.profile.location.geo ? true : false,
      msg: MESSAGES.locationAccessError
    }
    this.user = this.navParams.get('user');
    this.img = `assets/imgs/users/user3.jpg`;
  }

  capitalizeFirstLetter(str: string): string {
    return this.dataProvider.capitalizeFirstLetter(str);
  }

  getAge(date: string): string {
    return this.dataProvider.getAgeFromDate(date);
  }

  getDistance(user: User) {
    if (this.dataProvider.hasLocation(user, this.profile)) {
      return this.dataProvider.getLocationFromGeo(this.profile.location.geo, user.location.geo);
    } else {
      return null;
    }
  }


  openChats() {
    this.navCtrl.push(ChatPage);
  }

  requestUser(user) {
    console.log(user);
  }

  togglePopupMenu() {
    return this.openMenu = !this.openMenu;
  }

  followUser(user) {
    console.log(user);
  }
  likeUser(user) {
    console.log(user);
  }
  chatWithUser(user) {
    this.openMenu = false;
    this.navCtrl.push(ChatPage, { user });
  }

  rateUser() {
    const modal = this.modalCtrl.create(RateUserPage, { company: this.profile });
    modal.onDidDismiss(data => {
      if (data) {
        this.updateCompanyRating(data);
      }
    });
    modal.present();
  }

  updateCompanyRating(data) {
    // const newRatingData: Ratings = {
    //   id: data.company.id,
    //   rid: this.profile.uid,
    //   rating: data.rating,
    //   dateRated: this.dataProvider.getDateTime()
    // };
    // this.dataProvider.addUserActionToCollection(COLLECTION.ratings, this.allRatings, newRatingData, this.profile.uid);
  }

}
