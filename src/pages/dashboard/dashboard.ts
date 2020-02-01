import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { User } from '../../models/user';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { AuthProvider } from '../../providers/auth/auth';
import { DataProvider } from '../../providers/data/data';
import { COLLECTION } from '../../utils/consts';
import { ChatPage } from '../chat/chat';
import { bounceIn } from '../../utils/animations';
import { PresenceService } from '../../providers/presence/presence';

 
@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
  animations: [bounceIn]

})
export class DashboardPage {
  profile: User = null;

  isLoading: boolean = true;

  myRating: string;
  allRatings: any[] = [];
  usersIRated: any[] = [];
  usersRatedMe: any[] = [];

  myServices: any[] = [];

  allViewedServices: any[] = [];
  viewedServices: any[] = [];

  allSharedServices: any[] = []
  sharedServices: any[] = []

  requestedServices: any[] = [];
  allRequestedServices: any[] = []


  userKey: string = '';


  messages: any[] = [];
  chats: any[] = [];
  rated: any[] = [];
  viewed: any[] = [];
  
  onlineUsers: User[] = [];

  presence: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private feedbackProvider: FeedbackProvider,
    private modalCtrl: ModalController,
    public authProvider: AuthProvider,
    public dataProvider: DataProvider,
    public presenceProvider: PresenceService
  ) { }

  ionViewDidLoad() {
    this.profile = this.authProvider.getStoredUser();
    this.isLoading = false;


   this.presenceProvider.getPresence(this.profile.uid).subscribe(r => {
     this.presence = r;
      
    })
    


    this.chats = [
      {nickname: 'Chris', pic: 'assets/imgs/users/user8.jpg', uid: 'Xas234DFGH3fytrtfgDwqe'},
      {nickname: 'Marton', pic: 'assets/imgs/users/user3.jpg', uid: 'f6576GDFGH3fytrtfgDwqe'},
      {nickname: 'Moth99', pic: 'assets/imgs/users/user2.jpg', uid: '99867FGH3fytrtfgDwqe'},
      // {nickname: 'Pepe', pic: 'assets/imgs/users/user4.jpg', uid: 'i9009DFGH3fytrtfgDwqe'}
    ]
    // this.dataProvider.getCollectionByKeyValuePair(COLLECTION.services, 'uid', this.profile.uid).subscribe(services => {
    //   this.myServices = services;
    // });

    // this.dataProvider.getAllFromCollection(COLLECTION.viewedServices).subscribe(viewedServices => {
    //   this.allViewedServices = viewedServices;
    //   this.viewedServices = this.getMyServices(viewedServices);
    // });

    // this.dataProvider.getAllFromCollection(COLLECTION.sharedServices).subscribe(sharedServices => {
    //   this.allSharedServices = sharedServices;
    //   this.sharedServices = this.getMyServices(sharedServices);
    // });

    // this.dataProvider.getAllFromCollection(COLLECTION.requestedServices).subscribe(requestedServices => {
    //   this.allRequestedServices = requestedServices;
    //   this.requestedServices = this.getMyServices(requestedServices);
    // });

  }

  viewUserProfile(user) {
    this.navCtrl.push(ChatPage, { user });
  }

  isUserOnline(user) {
    return this.onlineUsers.filter(u => u.uid === user.uid);
  }

  viewChats() {

  }

  viewMessages() {

  }

  addRequests() {
    // const req: Activity = {
    //   sid: '9ztxr1oOj6PK554PHFHC',
    //   uid: 'S6DThtbqj9Q5fKL2A9Jyob0u6Kv1',
    //   oid: 'w4hqPS2ZlSNWQG611OqbDOJhcHP2',
    //   date: this.dataProvider.getDateTime()
    // }

    // this.dataProvider.addUserActivityToJobCollection(COLLECTION.requestedServices, req);

  }

  addViewed() {
    // const viewed: Activity = {
    //   sid: 'JoPX6xgk2N2cArRdQuTF',
    //   uid: 'E2VprUJr2QWeV6ZJeVgxQxHMhHs1',
    //   oid: 'C4ddMBE8lxSEFmHGZPzG6ZJSkQh1',
    //   date: this.dataProvider.getDateTime()
    // }

    // this.dataProvider.addUserActivityToJobCollection(COLLECTION.viewedServices, viewed);
  }

  addShared() {
    // const viewed: Activity = {
    //   sid: 'JoPX6xgk2N2cArRdQuTF',
    //   uid: 'E2VprUJr2QWeV6ZJeVgxQxHMhHs1',
    //   oid: 'w4hqPS2ZlSNWQG611OqbDOJhcHP2',
    //   date: this.dataProvider.getDateTime()
    // }

    // this.dataProvider.addUserActivityToJobCollection(COLLECTION.sharedServices, viewed);
  }

  rateUser() {
    // const rate: Rating = {
    //   rating: 3.5,
    //   uid: 'yuoVVtSUNHSo5hgJqCe1Ufz99JT2',
    //   rid: '7ibVJ1zwZbhj8K3y6jIqBgxTFEm1', //yuoVVtSUNHSo5hgJqCe1Ufz99JT2
    //   date: this.dataProvider.getDateTime()
    // };

    // if (!this.dataProvider.alreadyRated(this.allRatings, rate)) {
    //   this.dataProvider.addNewItem(COLLECTION.ratings, rate);
    // } else {
    //   console.log('already rated');

    // }
  }


  getMyServices(services): any[] {
    const myServices: any[] = [];
    const viewedServicesArray = this.dataProvider.getArrayFromObjectList(services);
    let viewedUsers;

    for (let i = 0; i < viewedServicesArray.length; i++) {
      viewedUsers = this.dataProvider.getArrayFromObjectList(viewedServicesArray[i]);
      for (let i = 1; i < viewedUsers.length; i++) { // viewedUsers['id', {}, {}]
        if (viewedUsers[i].oid === this.profile.uid) {
          myServices.push(viewedUsers[i]);
        }
      }
    }
    return myServices;
  }

  countIratedAndRatedMe(): number {
    return this.usersIRated.length + this.usersRatedMe.length || 0;
  }


  profilePicture(): string {
    return this.dataProvider.getProfilePicture(this.profile);
  }

  viewMyServices(services: any) {
    // this.feedbackProvider.presentModal(ServicesListPage, { services });
  }

  viewRequestedServices() {
    console.log('service requests');
  }

  viewSharedServices() {
    console.log('service shared');
  }

  viewProfile() {
    // this.navCtrl.push(ProfilePage);
  }

}
