import { Component } from '@angular/core';
import { IonicPage, NavController, Events, ModalController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { STORAGE_KEY, COLLECTION } from '../../utils/consts';
import { User } from '../../models/user';
import { bounceIn } from '../../utils/animations';
import { Photo } from '../../models/photo';
import { MediaProvider } from '../../providers/media/media';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import firebase from 'firebase';
import { FirebaseApiProvider } from '../../providers/firebase-api/firebase-api';
import { AngularFireDatabase } from '@angular/fire/database';
import { PreviewPage } from '../preview/preview';


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
    public modalCtrl: ModalController,
    public ionEvents: Events) {

  }

  ionViewDidLoad() {
    this.profile = this.firebaseApiProvider.getItemFromLocalStorage(STORAGE_KEY.user);
    this.imagesRef = `${COLLECTION.images}/${this.profile.uid}`;
    this.getAllImages();
    // this.mediaProvider.getFiles(COLLECTION.images, this.profile.uid).subscribe(imgs => {
    //   console.log(imgs);
    // })
  }

  previewImage() {
    let profileModal = this.modalCtrl.create(PreviewPage, { images: this.images });
    profileModal.present();
  }


  getAllImages() {
    this.isLoading = true;
    const firebaseDBRef = firebase.database().ref(`${this.imagesRef}`);
    this.isLoading = false;
    firebaseDBRef.on('value', tasksnap => {
      let tmp = [];
      tasksnap.forEach(taskData => {
        tmp.push({ key: taskData.key, ...taskData.val() })
      });
      this.imageObjects = tmp;
      this.downloadImages(tmp);
    });
  }

  downloadImages(images: any[]) {
    this.images = [];
    const tmpImg = [];
    images.forEach(img => {
      this.mediaProvider.getImageByFilename(img.url).then(resImg => {
        // this.images.push(resImg);
        console.log(resImg);
        tmpImg.push(resImg);
      }).catch(err => {
        console.log(err);
      });
    });

    this.images = tmpImg;
    console.log(tmpImg);

  }

  selectPhoto() {
    this.mediaProvider.selectPhoto().then(imageData => {
      const selectedPhoto = 'data:image/jpeg;base64,' + imageData;
      this.uploadPhotoAndUpdateUserDatabase(selectedPhoto);
    }, error => {
      this.feedbackProvider.presentToast('An error occured uploading the photo');
    });
  }

  private uploadPhotoAndUpdateUserDatabase(image): any {
    this.feedbackProvider.presentLoading('Updating photo...');
    let storageRef = firebase.storage().ref(COLLECTION.images);
    const filename = Math.floor(Date.now() / 1000);
    const imageRef = storageRef.child(`${this.profile.uid}/${filename}.jpg`);

    imageRef.putString(image, firebase.storage.StringFormat.DATA_URL).then(() => {
      const newImage: Photo = {
        url: filename + '.jpg',
        dateCreated: this.dataProvider.getDateTime()
      };
      this.firebaseApiProvider.addImageToRealtimeDB(this.imagesRef, newImage, filename.toString()).then(() => {
        this.feedbackProvider.dismissLoading();
        this.feedbackProvider.presentToast('Photo uploaded successfully');
      }).catch(err => {
        this.feedbackProvider.dismissLoading();
        console.log(err);
        this.feedbackProvider.presentToast('An error occured uploading the photo');
      });
    }).catch(err => {
      console.log(err);
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
