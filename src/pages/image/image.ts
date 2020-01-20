import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { DataProvider } from '../../providers/data/data';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-image',
  templateUrl: 'image.html',
})
export class ImagePage {
  img;
  profile: any;
  constructor(
    public feedbackProvider: FeedbackProvider,
    public dataProvider: DataProvider,
    public authProvider: AuthProvider,

    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.profile = this.authProvider.getStoredUser();
  }

  // takePicture() {
  //   this.feedbackProvider.presentLoading();
  //   this.imageProvider.takePhoto().then(imageData => {
  //     this.feedbackProvider.dismissLoading();
  //     this.img = 'data:image/jpeg;base64,' + imageData;
  //     this.dataProvider.addItemToUserDB(COLLECTION.images, this.profile, this.img);
  //   }, error => {
  //     this.feedbackProvider.dismissLoading();
  //     console.log("ERROR -> " + JSON.stringify(error));
  //   });
  // }

  // selectPicture() {
  //   this.feedbackProvider.presentLoading();
  //   this.imageProvider.selectPhoto().then(imageData => {
  //     this.feedbackProvider.dismissLoading();
  //     this.img = 'data:image/jpeg;base64,' + imageData;
  //     this.dataProvider.addItemToUserDB(COLLECTION.images, this.profile, this.img);
  //   }, error => {
  //     this.feedbackProvider.dismissLoading();
  //     console.log("ERROR -> " + JSON.stringify(error));
  //   });
  // }
}
