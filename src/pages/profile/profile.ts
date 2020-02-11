import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { STORAGE_KEY, COLLECTION } from '../../utils/consts';
import { User } from '../../models/user';
import { Ratings } from '../../models/ratings';
import { bounceIn } from '../../utils/animations';
import { Photo } from '../../models/photo';
import { MediaProvider } from '../../providers/media/media';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import firebase from 'firebase';
import { FirebaseApiProvider } from '../../providers/firebase-api/firebase-api';
import { AngularFireDatabase } from '@angular/fire/database';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  animations: [bounceIn]
})
export class ProfilePage {
  profile: User;
  userRating = 0;
  allRatings: any = [];

  images: string[] = [];
  imageObjects = [];
  imagesRef: string;
  isLoading: boolean;


  constructor(
    public navCtrl: NavController,
    public dataProvider: DataProvider,
    public mediaProvider: MediaProvider,
    public feedbackProvider: FeedbackProvider,
    public firebaseApiProvider: FirebaseApiProvider,
    public afDB: AngularFireDatabase,
    public ionEvents: Events) {

  }

  ionViewDidLoad() {
    this.profile = this.firebaseApiProvider.getItemFromLocalStorage(STORAGE_KEY.user);
    this.imagesRef = `${COLLECTION.images}/${this.profile.uid}/`;
    this.getAllImages();
    // this.mediaProvider.getFiles(COLLECTION.images, this.profile.uid).subscribe(imgs => {
    //   console.log(imgs);
    // })
  }


  getAllImages() {
    this.isLoading = true;
    const firebaseDBRef = firebase.database().ref(`${this.imagesRef}`);
    firebaseDBRef.on('value', tasksnap => {
      let tmp = [];
      tasksnap.forEach(taskData => {
        tmp.push({ key: taskData.key, ...taskData.val() })
      });
      this.imageObjects = tmp;
      console.log(tmp);
      this.downloadImages(tmp);
    }, () => {
      this.isLoading = false;
    });
  }


  downloadImages(images: any[]) {
    this.images = [];
    if (images && images.length > 0) {
      images.forEach(img => {
        this.mediaProvider.getImageByFilename(img.url).then(resImg => {
          this.images.push(resImg);
          this.isLoading = false;
          console.log(resImg);
        }).catch(err => {
          this.isLoading = false;
          console.log(err);
        });
      });
    } else {
      this.isLoading = false;
    }
  }

  selectPhoto() {
    this.feedbackProvider.presentLoading('Accessing media...');
    this.mediaProvider.selectPhoto().then(imageData => {
      this.feedbackProvider.dismissLoading();
      const selectedPhoto = 'data:image/jpeg;base64,' + imageData;
      this.uploadPhotoAndUpdateUserDatabase(selectedPhoto);
    }, error => {
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentToast('An error occured uploading the photo');
    });
  }

  private uploadPhotoAndUpdateUserDatabase(image): any {
    this.feedbackProvider.presentLoading('Updating photo...');
    let storageRef = firebase.storage().ref(COLLECTION.images);
    const filename = Math.floor(Date.now() / 1000);
    const imageRef = storageRef.child(`${this.profile.uid}/${filename}.jpg`);

    imageRef.putString(image, firebase.storage.StringFormat.DATA_URL).then(() => {
      this.feedbackProvider.dismissLoading();
      const newImage: Photo = {
        url: filename + '.jpg',
        dateCreated: this.dataProvider.getDateTime()
      };
      this.firebaseApiProvider.addImageToRealtimeDB(this.imagesRef, newImage).then(() => {
        this.feedbackProvider.dismissLoading();
        this.feedbackProvider.presentToast('Photo uploaded successfully');
      }).catch(err => {
        this.feedbackProvider.dismissLoading();
        this.feedbackProvider.presentToast('An error occured uploading the photo');
      });
    }).catch(err => {
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentToast('An error occured uploading the photo');
    });

  }

  getDistance(geo) {
    return this.dataProvider.getLocationFromGeo(geo);
  }

  getProfilePicture(): string {
    return `assets/imgs/users/${this.profile.gender}.svg`;
  }

  capitalizeFirstLetter(str) {
    return this.firebaseApiProvider.capitalizeFirstLetter(str)
  }

}
