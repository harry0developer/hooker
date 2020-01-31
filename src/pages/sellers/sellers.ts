import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
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

@IonicPage()
@Component({
  selector: 'page-sellers',
  templateUrl: 'sellers.html',
  animations: [bounceIn]

})
export class SellersPage {
  sellers: any [] = [];
  profile: User;
  images = [];
  oldImages = [];
  imgs = [];
  onlineUsers = [];
  isLoading: boolean = true;
  constructor(
    public navCtrl: NavController,
    public dataProvider: DataProvider,
    public authProvider: AuthProvider,
    public feedbackProvider: FeedbackProvider,
    public ionEvents: Events,
    public mediaProvider: MediaProvider) {
  }

  ionViewDidLoad() {
    this.profile = this.authProvider.getStoredUser();
    
    this.ionEvents.subscribe(EVENTS.imageUploadSuccess, (res) => {
      console.log('Image uploaded successfully', res);
      this.feedbackProvider.presentToast('Image upload success');
      this.ionEvents.unsubscribe(EVENTS.imageUploadSuccess)
    });

    this.ionEvents.subscribe(EVENTS.imageUploadError, (res) => {
      console.log('An error occured uploading image', res);
      this.ionEvents.unsubscribe(EVENTS.imageUploadError)
    });

    this.dataProvider.getAllFromCollection(COLLECTION.users).subscribe(users => {
      this.sellers = users.filter(u => u.userType === USER_TYPE.seller);
      this.isLoading = false;
    }); 

    this.dataProvider.getAllFromCollection(COLLECTION.images).subscribe(r => {
      const myOldImages = r.filter(a => a.id === this.profile.uid);
      if(myOldImages.length > 0 && myOldImages[0]) {
        delete myOldImages[0].id;
        this.oldImages = this.dataProvider.getArrayFromObjectList(myOldImages[0]);
        console.log(this.oldImages);
        this.downloadImages();
      } else {
        this.oldImages = this.dataProvider.getArrayFromObjectList(myOldImages[0]);
        console.log(this.oldImages);
        this.downloadImages();
      }
    });
  } 

  isUserOnline(user) {
    return this.onlineUsers.filter(u => u.uid === user.uid);
  }

  downloadImages() {
    this.oldImages.forEach(img => {
      this.mediaProvider.getImage(img.url).then(resImg => {
        this.images.push(resImg);
        console.log(resImg);
        
      }).catch(err => {
        console.log(err);
      });
    });
  }
  

  addImage() {
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

  viewUserProfile(user) {
    this.navCtrl.push(SellerDetailsPage, { user });
  }

  getAge(date: string): string {
    return this.dataProvider.getAgeFromDate(date);
  }

  getDistance(geo) {
    return this.dataProvider.getLocationFromGeo(geo);
  }
}
