import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { UserDetailsPage } from '../user-details/user-details';

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {
  users: any = [
    {
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
    },
    {
      nickname: "Queen Slay",
      id: 3,
      rating: "4",
      dob: "1993-07-18",
      gender: "female",
      race: "coloured",
      bodyType: "bbw",
      location: {
        address: "900 Sunnyside, Pretoria,",
        geo: {
          lat: -25.910187,
          lng: 28.898042
        }
      }
    },
    {
      nickname: "Mia Low",
      id: 4,
      rating: "4.8",
      dob: "1996-03-20",
      gender: "female",
      race: "indian",
      bodyType: "thick",
      location: {
        address: "891 Centurion, Pretoria",
        geo: {
          lat: -25.910187,
          lng: 28.698042
        }
      }
    },
    {
      nickname: "Sally Sea",
      id: 5,
      rating: "3.5",
      dob: "1990-12-24",
      gender: "female",
      race: "black",
      bodyType: "thick",
      location: {
        address: "123 Arcadia, Pretoria",
        geo: {
          lat: -25.610187,
          lng: 28.998042
        }
      }
    }
  ];
  constructor(public navCtrl: NavController, public dataProvider: DataProvider) {
  }

  ionViewDidLoad() { }

  viewUserProfile(user) {
    this.navCtrl.push(UserDetailsPage, { user });
  }

  getAge(date: string): string {
    return this.dataProvider.getAgeFromDate(date);
  }

  getDistance(geo) {
    return this.dataProvider.getLocationFromGeo(geo);
  }

}
