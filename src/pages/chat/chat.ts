import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { DataProvider } from '../../providers/data/data';
import { FirebaseApiProvider } from '../../providers/firebase-api/firebase-api';



@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  user: User;
  profile: User;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public firebaseApiProvider: FirebaseApiProvider,
    public dataProvider: DataProvider) { }

  ionViewDidLoad() {
    this.profile = this.firebaseApiProvider.getLoggedInUser();
    this.user = this.navParams.get('user');
    console.log(this.user);

  }

  sendMessage() {
    console.log('Send messages');
  }

  capitalizeFirstLetter(str: string): string {
    return this.dataProvider.capitalizeFirstLetter(str);
  }

  getProfilePicture(): string {
    return 'assets/imgs/users/male.svg'; // this.user && this.user.profilePic ? this.user.profilePic : `assets/imgs/users/${this.user.gender}.svg`;
  }
}
