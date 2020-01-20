import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserDetailsPage } from '../user-details/user-details';
import { DataProvider } from '../../providers/data/data';

@IonicPage()
@Component({
  selector: 'page-requests',
  templateUrl: 'requests.html',
})
export class RequestsPage {
  users = [{
    nickname: "Mia Mommy Tee Low",
    id: 1,
    rating: "3.5",
    dob: "1991-02-22",
    gender: "female",
    race: "black",
    bodyType: "slim-thick",
    location: {
      address: "123 Arcadia, Pretoria",
      geo: {
        lat: -25.950187,
        lng: 28.998042
      }
    }
  },
  {
    nickname: "Kitty Mami",
    id: 2,
    rating: "4.5",
    dob: "1993-07-19",
    gender: "female",
    race: "black",
    bodyType: "thick",
    location: {
      address: "9090 Heart street, Menlyn, Pretoria",
      geo: {
        lat: -25.910187,
        lng: 28.998042
      }
    }
  },];
  constructor(public navCtrl: NavController, public navParams: NavParams, private dataProvider: DataProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RequestsPage');
  }

  viewUserDetails(user) {
    this.navCtrl.push(UserDetailsPage, { user });
  }

  getDistance(geo) {
    return this.dataProvider.getLocationFromGeo(geo);
  }

}
