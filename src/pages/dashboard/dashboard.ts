import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { User } from '../../models/user';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { AuthProvider } from '../../providers/auth/auth';
import { DataProvider } from '../../providers/data/data';
import { COLLECTION } from '../../utils/consts';
import { ChatPage } from '../chat/chat';
import { bounceIn } from '../../utils/animations';
import { FirebaseApiProvider } from '../../providers/firebase-api/firebase-api';
import { Photo } from '../../models/photo';
import { MediaProvider } from '../../providers/media/media';
import firebase from 'firebase';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

 
@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
  animations: [bounceIn]

})
export class DashboardPage {
  profile: User = null;
  isLoading: boolean = true;

  messages: any[] = [];
  chats: any[] = [];
 
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private feedbackProvider: FeedbackProvider,
    private modalCtrl: ModalController,
    public authProvider: AuthProvider,
    public dataProvider: DataProvider,
    public firebaseApiProvider: FirebaseApiProvider,
    public mediaProvider: MediaProvider
  ) {  } 

  ionViewDidLoad() {
    // this.profile = this.authProvider.getStoredUser();
    // this.chats = [
    //   {nickname: 'Charle', pic: 'assets/imgs/users/user1.jpg'},
    //   {nickname: 'Mark', pic: 'assets/imgs/users/user2.jpg'},
    //   {nickname: 'Thabo', pic: 'assets/imgs/users/user3.jpg'}
    // ];
    // this.isLoading = false;
  }

  viewUserProfile(user) {
    this.navCtrl.push(ChatPage, { user });
  }

  profilePicture(): string {
    return 'assets/imgs/users/user6.jpg'
  }
 
}
