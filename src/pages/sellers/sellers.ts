import { Component } from '@angular/core';
import { IonicPage, NavController, Events, ModalController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { SellerDetailsPage } from '../seller-details/seller-details';
import { COLLECTION, USER_TYPE, EVENTS } from '../../utils/consts';
import { User } from '../../models/user';
import { AuthProvider } from '../../providers/auth/auth';
import { MediaProvider } from '../../providers/media/media';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { Photo } from '../../models/photo';
import firebase from 'firebase';
import { bounceIn } from '../../utils/animations';
import { FirebaseApiProvider } from '../../providers/firebase-api/firebase-api';
import { FilterPage } from '../filter/filter';
import { Filter } from '../../models/filter';


@IonicPage()
@Component({
  selector: 'page-sellers',
  templateUrl: 'sellers.html',
  animations: [bounceIn]

})
export class SellersPage {
  sellers: any[] = [];
  profile: User;
  images = [];
  oldImages = [];
  imgs = [];
  onlineUsers = [];
  isLoading: boolean = true;
  filter: Filter = {
    distance: 100,
    age: 99,
    race: 'all'
  };
  constructor(
    public navCtrl: NavController,
    public dataProvider: DataProvider,
    public authProvider: AuthProvider,
    public feedbackProvider: FeedbackProvider,
    public mediaProvider: MediaProvider,
    public modalCtrl: ModalController,
    public firebaseApiProvider: FirebaseApiProvider) {
  }

  ionViewDidLoad() {
    const ref = this.firebaseApiProvider.firebaseRef.ref(`/${COLLECTION.users}`);
    ref.on("value", snap => {
      this.sellers = this.snapshotToArray(snap);
      this.isLoading = false;
    });
  }

  filterUsers() {
    let modal = this.modalCtrl.create(FilterPage, { filter: this.filter });
    modal.onDidDismiss(data => {
      if (data) {
        this.filter = { ...data };
        console.log(this.filter);
      }
    });
    modal.present();
  }

  snapshotToArray(snapshot): any[] {
    let returnArr = [];
    snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item.key = childSnapshot.key;
      if (item.userType.toLowerCase() === USER_TYPE.seller) {
        returnArr.push(item);
      }
    });
    this.isLoading = false;
    return returnArr;
  }

  // downloadImages() {
  //   this.oldImages.forEach(img => {
  //     this.mediaProvider.getImage(img.url).then(resImg => {
  //       this.images.push(resImg);
  //       console.log(resImg);

  //     }).catch(err => {
  //       console.log(err);
  //     });
  //   });
  // }

  addImage() {
    const newImage: Photo = { dateCreated: this.dataProvider.getDateTime(), url: 'photo2.jpg' };
    this.dataProvider.addItemToUserDB(COLLECTION.images, this.profile, newImage);
  }

  getImages() {
    this.dataProvider.getAllFromCollection(COLLECTION.images).subscribe(imgs => {
      console.log(imgs);
    })
  }

  selectPhotoAndUpload() {
    this.mediaProvider.selectPhoto().then(imageData => {
      const captureDataUrl = 'data:image/jpeg;base64,' + imageData;
      this.uploadPhotoAndUpdateUserDatabase(this.oldImages, captureDataUrl);
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }

  takePhotoAndUpload() {
    this.mediaProvider.takePhoto().then(imageData => {
      const captureDataUrl = 'data:image/jpeg;base64,' + imageData;
      this.uploadPhotoAndUpdateUserDatabase(this.oldImages, captureDataUrl);
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }

  uploadPhotoAndUpdateUserDatabase(oldImages, newImage): any {
    this.feedbackProvider.presentLoading('Please wait, Uploading...');
    let storageRef = firebase.storage().ref();
    const filename = Math.floor(Date.now() / 1000);
    const imageRef = storageRef.child(`${this.profile.uid}/${filename}.jpg`);

    imageRef.putString(newImage, firebase.storage.StringFormat.DATA_URL).then(() => {
      this.feedbackProvider.dismissLoading();
      const newImageObject: Photo = {
        url: filename + '.jpg',
        dateCreated: this.dataProvider.getDateTime()
      }
      this.dataProvider.addItemToUserDB(COLLECTION.images, this.profile, newImageObject);
    }).catch(err => {
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentToast('Image upload failed');
    });

  }

  viewUserProfile(user) {
    this.navCtrl.push(SellerDetailsPage, { user });
  }

  getDistance(geo) {
    return this.dataProvider.getLocationFromGeo(geo);
  }
}
