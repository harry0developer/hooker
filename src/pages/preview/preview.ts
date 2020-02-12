import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ViewController } from 'ionic-angular';
import { Slides } from 'ionic-angular';

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

  @ViewChild(Slides) slides: Slides;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public viewCtrl: ViewController
  ) { }

  ionViewDidLoad() {
    this.images = this.navParams.get('images');
  }

  previousSlide() {
    this.slides.slidePrev();
  }

  nextSlide() {
    this.slides.slideNext();
  }

  makeProfilePicture() {
    console.log(this.slides.getActiveIndex());
    this.presentActionSheet('Make profile photo');
  }

  deleteImage() {
    console.log(this.slides.getActiveIndex());
    this.presentActionSheet('Delete photo');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  presentActionSheet(title: string) {
    let actionSheet = this.actionSheetCtrl.create({
      title,
      buttons: [
        {
          text: 'Confirm',
          handler: () => {
            console.log('confirm clicked');
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
