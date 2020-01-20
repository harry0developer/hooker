import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MultiLoginPage } from './multi-login';

@NgModule({
  declarations: [
    MultiLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(MultiLoginPage),
  ],
})
export class MultiLoginPageModule {}
