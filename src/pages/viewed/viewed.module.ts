import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewedPage } from './viewed';

@NgModule({
  declarations: [
    ViewedPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewedPage),
  ],
})
export class ViewedPageModule {}
