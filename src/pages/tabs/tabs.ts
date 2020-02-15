import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { ChatsPage } from '../chats/chats';
import { ProfilePage } from '../profile/profile';
import { SettingsPage } from '../settings/settings';
import { NavParams } from 'ionic-angular';
import { USER_TYPE } from '../../utils/consts';
import { DashboardPage } from '../dashboard/dashboard';
import { SellersPage } from '../sellers/sellers';
import { User } from '../../models/user';

@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage {

  user: User;
  tab1Root = null;
  tab2Root = ChatsPage;
  tab3Root = ProfilePage;
  tab4Root = SettingsPage;
  icon: string;

  constructor(public navParams: NavParams) {
    this.user = this.navParams.get('user');
  }

  ionViewWillLoad() {
    if (this.isSeller()) {
      this.tab1Root = DashboardPage;
      this.icon = "apps";
    } else {
      this.tab1Root = SellersPage;
      this.icon = "locate";
    }
  }

  isSeller(): boolean {
    return this.user && this.user.userType.toLocaleLowerCase() === USER_TYPE.seller.toLocaleLowerCase();
  }
}
