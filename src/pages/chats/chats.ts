import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { COLLECTION, STORAGE_KEY } from '../../utils/consts';
import { User } from '../../models/user';
 
@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {
  chats: any[] = [];
  profile: User;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public dataProvider: DataProvider) {
  }

  ionViewDidLoad() {
    this.profile = this.dataProvider.getItemFromLocalStorage(STORAGE_KEY.user);
  }

}
