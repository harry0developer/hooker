import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
 
@IonicPage()
@Component({
  selector: 'page-rate-user',
  templateUrl: 'rate-user.html',
})
export class RateUserPage {
  user: any;
  rating: string = '';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCntrl: ViewController,
    public dataProvider: DataProvider,
  ) { }

  ionViewDidLoad() {
    this.user = this.navParams.get('user');
  }

  rateCompany() {
    const ratingData = {
      user: this.user,
      rating: this.rating,
    }
    this.viewCntrl.dismiss(ratingData);
  }

  dismiss() {
    this.viewCntrl.dismiss();
  }
}
