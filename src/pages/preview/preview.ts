import { Component, ViewChild, ContentChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ViewController, Slide } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { MediaProvider } from '../../providers/media/media';
import { FirebaseApiProvider } from '../../providers/firebase-api/firebase-api';
import { COLLECTION, STORAGE_KEY } from '../../utils/consts';
import { User } from '../../models/user';
import { FeedbackProvider } from '../../providers/feedback/feedback';

@IonicPage()
@Component({
  selector: 'page-preview',
  templateUrl: 'preview.html',
})
export class PreviewPage {
  // images = [
  //   'https://firebasestorage.googleapis.com/v0/b/hooker-6ca60.appspot.com/o/images%2FHfkpiBaaBxh4Wala65cMDWa5gtq2%2F1581458804.jpg?alt=media&token=db5f87d5-9024-4182-9e31-2d2e88342f97',
  //   'https://firebasestorage.googleapis.com/v0/b/hooker-6ca60.appspot.com/o/images%2FHfkpiBaaBxh4Wala65cMDWa5gtq2%2F1581458784.jpg?alt=media&token=06ad2ef2-f400-4e00-a7ce-a047e7e82354',
  //   'https://firebasestorage.googleapis.com/v0/b/hooker-6ca60.appspot.com/o/images%2FHfkpiBaaBxh4Wala65cMDWa5gtq2%2F1581458816.jpg?alt=media&token=78fa09b3-1924-458b-a3fc-2c0d54d69272'
  // ];

  images = [];
  profile: User;
  @ViewChild(Slides) slides: Slides;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public viewCtrl: ViewController,
    public mediaProvider: MediaProvider,
    public firebaseApiProvider: FirebaseApiProvider,
    public feedbackProvider: FeedbackProvider
  ) { }


  ionViewWillLoad() {
    this.images = this.navParams.get('images');
    this.profile = this.firebaseApiProvider.getItemFromLocalStorage(STORAGE_KEY.user);
  }

  removeImage(img) {
    console.log(img);
    this.feedbackProvider.presentLoading('Deleting photo...');
    this.mediaProvider.removeImageByFilename(img.url).then(r => {
      this.feedbackProvider.dismissLoading();
      this.viewCtrl.dismiss();
      this.feedbackProvider.presentLoading('Updating profile...');
      this.firebaseApiProvider.removeItem(`${COLLECTION.images}/${this.profile.uid}`, img.key).then(() => {
        this.feedbackProvider.dismissLoading();
      }).catch(err => {
        this.feedbackProvider.dismissLoading();
        console.log(err);
      })
    }).catch(err => {
      this.feedbackProvider.dismissLoading();
      console.log(err);
    })
  }

  previousSlide() {
    this.slides.slidePrev();
  }

  nextSlide() {
    this.slides.slideNext();
  }

  makeProfilePicture() {
    this.presentActionSheet('Make profile photo');
  }

  deleteImage(ref) {
    let toBeDeleted;
    this.images.forEach(img => {
      if (img.url === ref.alt) {
        toBeDeleted = img;
      }
    });
    this.presentActionSheet('Delete photo', toBeDeleted);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  presentActionSheet(title: string, data = null) {
    let actionSheet = this.actionSheetCtrl.create({
      title,
      buttons: [
        {
          text: 'Confirm',
          handler: () => {
            this.removeImage(data);
          }
        },
        {
          text: 'Cancel',
          role: 'destructive',
          handler: () => {
            console.log('cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

}
