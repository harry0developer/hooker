import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  user1: any = {
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
  };

  user2 = {
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
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  sendMessage() {
    console.log('Send messages');
  }

}
