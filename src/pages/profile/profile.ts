import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { STORAGE_KEY, COLLECTION } from '../../utils/consts';
import { User } from '../../models/user';
import { Ratings } from '../../models/ratings';
import { bounceIn } from '../../utils/animations';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  animations: [bounceIn]
})
export class ProfilePage {
  user : User;
  img: string;
  userRating = 0;
  allRatings: any = [];

  images = [];
  constructor(public navCtrl: NavController, public dataProvider: DataProvider) {
  }

  ionViewDidLoad() {

    this.images = [
      'assets/imgs/users/user1.jpg',
      'assets/imgs/users/user2.jpg',
      'assets/imgs/users/user3.jpg',
      'assets/imgs/users/user4.jpg',
      'assets/imgs/users/user5.jpg',
      'assets/imgs/users/user6.jpg',
      'assets/imgs/users/user7.jpg',
      'assets/imgs/users/user8.jpg',
      'assets/imgs/users/user9.jpg',
      'assets/imgs/users/user10.jpg',
    ]
    this.user = this.dataProvider.getItemFromLocalStorage(STORAGE_KEY.user);
    this.img = `assets/imgs/users/user1.jpg`;
    this.dataProvider.getAllFromCollection(COLLECTION.ratings).subscribe(ratingsFromCollection => {
      const r = this.dataProvider.getArrayFromObjectList(ratingsFromCollection);
      this.allRatings = this.dataProvider.getArrayFromObjectList(r);
      // this.isLoading = false;
      this.userRating = this.calculateUserRating();
      console.log(this.userRating);
    }); 
  }

  calculateUserRating() {
    const index = this.getCompanyIndex(this.user);
    if (index !== -999) {
      delete this.allRatings[index].id;
      const arrayRatingData = this.allRatings[index];
      return parseFloat(this.dataProvider.calculateRating(
        this.dataProvider.getArrayFromObjectList(arrayRatingData)).toFixed(1));
    } else {
      return 0;
    }
  }

  getCompanyIndex(user: User): number {
    let index = -999;
    this.allRatings.forEach((r, i) => {
      if (r[0] && user && r[0].id === user.uid) {
        index = this.allRatings.indexOf(r);
      }
    });
    return index;
  }

  getAge(date: string): string {
    return this.dataProvider.getAgeFromDate(date);
  }

  getDistance(geo) {
    return this.dataProvider.getLocationFromGeo(geo);
  }


}
