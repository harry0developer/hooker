import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SkeletonItemComponent } from './skeleton-item/skeleton-item';
import { LocationStatusComponent } from './location-status/location-status';
@NgModule({
	declarations: [SkeletonItemComponent,
    LocationStatusComponent],
	imports: [IonicModule],
	exports: [SkeletonItemComponent,
    LocationStatusComponent]
})
export class ComponentsModule {}
