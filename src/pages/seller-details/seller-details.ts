import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { ChatPage } from '../chat/chat';
import { RateUserPage } from '../rate-user/rate-user';
import { MESSAGES, COLLECTION } from '../../utils/consts';
import { Observable } from 'rxjs';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { User } from '../../models/user';
import { Image } from '../../models/image';
import { AuthProvider } from '../../providers/auth/auth';
import { FirebaseApiProvider } from '../../providers/firebase-api/firebase-api';
import { MediaProvider } from '../../providers/media/media';

@IonicPage()
@Component({
  selector: 'page-seller-details',
  templateUrl: 'seller-details.html',
})
export class SellerDetailsPage {
  profile: User;
  user: User;
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
  images: Image[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public feedbackProvider: FeedbackProvider,
    public firebaseApiProvider: FirebaseApiProvider,
    public dataProvider: DataProvider,
    public mediaProvider: MediaProvider,
    public zone: NgZone,
    public authProvider: AuthProvider) {
  }

  ionViewDidLoad() {
    this.isLoading = true;
    this.profile = this.authProvider.getStoredUser();
    this.locationAccess = this.navParams.get('locationAccess');
    this.user = this.navParams.get('user');

    this.getUserImages(this.user);
    // this.locationAccess = {
    //   allowed: this.profile.location && this.profile.location.lat && this.profile.location.lat ? true : false,
    //   msg: MESSAGES.locationAccessError
    // }
  }

  hasPhotos(): boolean {
    return this.images.length > 0;
  }

  getUserImages(user: User) {
    this.firebaseApiProvider.getItem(COLLECTION.images, user.uid).then(res => {
      const imgObj = res.val()
      const imgs = this.firebaseApiProvider.convertObjectToArray(imgObj);
      this.downloadImagesFromStorage(user, imgs);
    }).catch(err => {
      console.log(err);
    });
  }

  downloadImagesFromStorage(user: User, imgs: Image[]) {
    this.images = [];
    this.zone.run(() => {
      imgs.forEach(img => {
        this.mediaProvider.getImageByFilename(user.uid, img.url).then(resImg => {
          const myImg = { ...img, path: resImg };
          this.isLoading = false;
          this.images.push(myImg);
        }).catch(err => {
          console.log(err);
        })
      })
    });
  }

  // downloadImageFromFirebaseStorage(user: User, img: Image): any {
  //   let dImg;
  //   this.mediaProvider.getImageByFilename(user.uid, img.url).then(resImg => {
  //     const myImg = { ...img, path: resImg };
  //     dImg = myImg;
  //     console.log(myImg);

  //   }).catch(err => {
  //     console.log(err);
  //     dImg = null;
  //   });
  //   return dImg;
  // }

  capitalizeFirstLetter(str: string): string {
    return this.dataProvider.capitalizeFirstLetter(str);
  }

  getAge(date: string): string {
    return this.dataProvider.getAgeFromDate(date);
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

  chatWithUser(user) {
    this.openMenu = false;
    this.navCtrl.push(ChatPage, { user });
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
