import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RateUserPage } from './rate-user';

@NgModule({
  declarations: [
    RateUserPage,
  ],
  imports: [
    IonicPageModule.forChild(RateUserPage),
  ],
})
export class RateUserPageModule {}
