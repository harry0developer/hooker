import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { STORAGE_KEY, COLLECTION } from '../../utils/consts';
import { User } from '../../models/user';
import { Ratings } from '../../models/ratings';
import { bounceIn } from '../../utils/animations';
import { Photo } from '../../models/photo';
import { MediaProvider } from '../../providers/media/media';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  animations: [bounceIn]
})
export class ProfilePage {
  profile : User;
  img: string;
  userRating = 0;
  allRatings: any = [];

  images = [];
  constructor(
    public navCtrl: NavController, 
    public dataProvider: DataProvider,
    public mediaProvider: MediaProvider,
    public feedbackProvider: FeedbackProvider) {
  }

  ionViewDidLoad() {

    this.images = [
      'assets/imgs/users/user1.jpg',
      'assets/imgs/users/user2.jpg',
      'assets/imgs/users/user3.jpg',
      'assets/imgs/users/user4.jpg',
      'assets/imgs/users/user5.jpg',
      'assets/imgs/users/user6.jpg',
      'assets/imgs/users/user7.jpg',
      'assets/imgs/users/user8.jpg',
      'assets/imgs/users/user9.jpg',
      'assets/imgs/users/user10.jpg',
    ]
    this.profile = this.dataProvider.getItemFromLocalStorage(STORAGE_KEY.user);
    console.log(this.profile);
    
    this.img = `assets/imgs/users/user1.jpg`;
    this.dataProvider.getAllFromCollection(COLLECTION.ratings).subscribe(ratingsFromCollection => {
      const r = this.dataProvider.getArrayFromObjectList(ratingsFromCollection);
      this.allRatings = this.dataProvider.getArrayFromObjectList(r);
      console.log(this.userRating);
    }); 
  } 
  getAge(date: string): string {
    return this.dataProvider.getAgeFromDate(date);
  }

  getDistance(geo) {
    return this.dataProvider.getLocationFromGeo(geo);
  }

  hasImages(): boolean {
    return this.images && this.images.length > 0;
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

  addPhoto() {
    const newImage: Photo = {dateCreated: this.dataProvider.getDateTime(), url: 'photo2.jpg'};
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
      // this.uploadPhotoAndUpdateUserDatabase(this.oldImages, captureDataUrl);
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }


  uploadPhotoAndUpdateUserDatabase(oldImages, newImage): any {
    this.feedbackProvider.presentLoading('Please wait, Uploading...');
    let storageRef = firebase.storage().ref();
    const filename = Math.floor(Date.now() / 1000);
    const imageRef = storageRef.child(`${this.profile.uid}/${filename}.jpg`);

    imageRef.putString(newImage, firebase.storage.StringFormat.DATA_URL).then(()=> {
      this.feedbackProvider.dismissLoading();
      const newImageObject: Photo = {
        url: filename+'.jpg',
        dateCreated: this.dataProvider.getDateTime()
      }
      this.dataProvider.addItemToUserDB(COLLECTION.images, this.profile, newImageObject);
    }).catch(err => {
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentToast('Image upload failed');
    });

  }


}
