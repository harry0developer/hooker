import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { SellerDetailsPage } from '../seller-details/seller-details';
import { COLLECTION, USER_TYPE, EVENTS } from '../../utils/consts';
import { User } from '../../models/user';
import { AuthProvider } from '../../providers/auth/auth';
import { MediaProvider } from '../../providers/media/media';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { Photo } from '../../models/photo';
import { Filter } from '../../models/filter';
import { bounceIn } from '../../utils/animations';
import { FilterPage } from '../filter/filter';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-visitor',
  templateUrl: 'visitor.html',
  animations: [bounceIn]
})
export class VisitorPage {
  sellers: any [] = [];
  profile: User;
  images = [];
  oldImages = [];
  imgs = [];
  isLoading: boolean = true;
  filter: Filter = {
    distance: 100,
    age: 99,
    race: 'all'
  }
  constructor(
    public navCtrl: NavController,
    public dataProvider: DataProvider,
    public authProvider: AuthProvider,
    public feedbackProvider: FeedbackProvider,
    public mediaProvider: MediaProvider,
    public modalCtrl: ModalController
    ) {
  }

  ionViewDidLoad() {
    this.profile = this.authProvider.getStoredUser();
    this.dataProvider.getAllFromCollection(COLLECTION.users).subscribe(users => {
      this.sellers = users;
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

  capitalizeFirstLetter(str: string): string {
    return this.dataProvider.capitalizeFirstLetter(str);
  } 

  filterUsers() {

    let modal = this.modalCtrl.create(FilterPage,  {filter: this.filter});
    modal.onDidDismiss(data => {
      if (data) {
        this.filter = {...data};
        console.log(this.filter);
      }
    });
    modal.present();
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
 
  getDistance(geo) {
    return this.dataProvider.getLocationFromGeo(geo);
  }
}
