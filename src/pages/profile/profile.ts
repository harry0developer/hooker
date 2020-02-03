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

export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  animations: [bounceIn]
})
export class ProfilePage {
  profile : User;
  userRating = 0;
  allRatings: any = [];

  images: string[] = [];
  imageObjects = [];
  imagesRef: string;


  constructor(
    public navCtrl: NavController, 
    public dataProvider: DataProvider,
    public mediaProvider: MediaProvider,
    public feedbackProvider: FeedbackProvider,
    public firebaseApiProvider: FirebaseApiProvider,
    public afDB: AngularFireDatabase,
    public ionEvents: Events) {
      this.profile = this.dataProvider.getStoredUser(); 
      this.imagesRef = `${COLLECTION.images}/${this.profile.uid}/`;
      this.getAllImages();
  }

  ionViewDidLoad() {  } 

  
  getAllImages() {
    this.feedbackProvider.presentLoading('Please wait, fetching photos...');
    const firebaseDBRef = firebase.database().ref(`${this.imagesRef}`);
    firebaseDBRef.on('value', tasksnap => {
      let tmp = [];
      tasksnap.forEach(taskData => {
        tmp.push({ key: taskData.key, ...taskData.val() })
      });
      this.imageObjects = tmp;
      this.downloadImages(tmp); 
      this.feedbackProvider.dismissLoading();
    }, () => {
      this.feedbackProvider.dismissLoading();
    }); 
  }

  removeItem() { 
    this.firebaseApiProvider.removeItem(this.imagesRef, this.imageObjects[0].key).then(() => {
      console.log('image remove success');
    }).catch(err => {
      console.log('Error removing image', err);
    });
  }
 
  getProfilePicture(): string {
    return 'assets/imgs/users/user6.jpg';
  }

  downloadImages(images: any[]){
    this.images = [];
    images.forEach(img => {
      this.mediaProvider.getImage(img.url).then(resImg => {
        this.images.push(resImg);
      }).catch(err => {
        console.log(err);
      });
    });
  }
  
  selectPhoto() {
    this.feedbackProvider.presentLoading('Please wait, selecting photo...');
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
    this.feedbackProvider.presentLoading('Please wait, Uploading...');
    let storageRef = firebase.storage().ref('images');
    const filename = Math.floor(Date.now() / 1000);
    const imageRef = storageRef.child(`${this.profile.uid}/${filename}.jpg`);

    imageRef.putString(image, firebase.storage.StringFormat.DATA_URL).then(()=> {
      this.feedbackProvider.dismissLoading();
      const newImageObject: Photo = {
        url: filename+'.jpg',
        dateCreated: this.dataProvider.getDateTime()
      };
      this.feedbackProvider.presentLoading('Please wait, updating profile...');
      this.firebaseApiProvider.addItem(this.imagesRef, newImageObject).then(() => {
        this.feedbackProvider.dismissLoading();
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

  hasImages(): boolean {
    return this.images && this.images.length > 0;
  } 

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

}
