import { Component } from '@angular/core'; 
import { HomePage } from '../home/home';
import { ChatsPage } from '../chats/chats';
import { ProfilePage } from '../profile/profile';
import { SettingsPage } from '../settings/settings';
import { NavParams } from 'ionic-angular';
import { USER_TYPE } from '../../utils/consts';
import { DashboardPage } from '../dashboard/dashboard';
import { SellersPage } from '../sellers/sellers';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  userType: string;
  tab1Root = null;
  tab2Root = ChatsPage;
  tab3Root = ProfilePage;
  tab4Root = SettingsPage;
  icon: string;

  constructor(public navParams: NavParams) { 
    this.userType = this.navParams.get('userType');
  }

  ionViewWillLoad() {
    if(this.isSeller()) {
      this.tab1Root = DashboardPage;
      this.icon = "app";
    } else {
      this.tab1Root = SellersPage;
      this.icon = "locate";
    }
  }

  isSeller(): boolean{ 
    console.log(this.userType);
    
    return this.userType === USER_TYPE.seller;
  }
}
