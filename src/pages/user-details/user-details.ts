import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { ChatPage } from '../chat/chat';

@IonicPage()
@Component({
  selector: 'page-user-details',
  templateUrl: 'user-details.html',
})
export class UserDetailsPage {
  user: any;
  img: string = "";
  category: string = 'info';
  openMenu: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dataProvider: DataProvider) {
  }

  ionViewDidLoad() {
    this.user = this.navParams.get('user');
    this.img = `assets/imgs/users/user${this.user.id}.jpg`;
  }

  getAge(date: string): string {
    return this.dataProvider.getAgeFromDate(date);
  }

  getDistance(geo) {
    return this.dataProvider.getLocationFromGeo(geo);
  }

  requestUser(user) {
    console.log(user);
  }

  togglePopupMenu() {
    return this.openMenu = !this.openMenu;
  }

  followUser(user) {
    console.log(user);
  }
  likeUser(user) {
    console.log(user);
  }
  chatWithUser(user) {
    this.openMenu = false;
    this.navCtrl.push(ChatPage, { user });
  }

}
