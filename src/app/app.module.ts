import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { firebaseConfig } from '../config';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { BrMaskerModule } from 'brmasker-ionic-3';
import { HttpClientModule } from '@angular/common/http';

import { AuthProvider } from '../providers/auth/auth';
import { FeedbackProvider } from '../providers/feedback/feedback';
import { DataProvider } from '../providers/data/data';
import { SignupPage } from '../pages/signup/signup';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';

import { RatingModule } from "ngx-rating";
import { RequestsPage } from '../pages/requests/requests';
import { ProfilePage } from '../pages/profile/profile';
import { ChatPage } from '../pages/chat/chat';
import { ImagePage } from '../pages/image/image';
import { Camera } from '@ionic-native/camera';
import { WindowProvider } from '../providers/window/window';
import { NationalityPage } from '../pages/nationality/nationality';
import { MultiLoginPage } from '../pages/multi-login/multi-login';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { SellersPage } from '../pages/sellers/sellers';
import { SellerDetailsPage } from '../pages/seller-details/seller-details';
import { ViewedPage } from '../pages/viewed/viewed';
import { RatedPage } from '../pages/rated/rated';
import { ChatsPage } from '../pages/chats/chats';
import { IntroPage } from '../pages/intro/intro';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { TermsPage } from '../pages/terms/terms';
import { SetupPage } from '../pages/setup/setup';
import { PlacesPage } from '../pages/places/places';
import { LocationProvider } from '../providers/location/location';

import { Geolocation } from '@ionic-native/geolocation';
import { MediaProvider } from '../providers/media/media';
import { ComponentsModule } from '../components/components.module';
import { TabsPage } from '../pages/tabs/tabs';
import { SettingsPage } from '../pages/settings/settings';
import { FirebaseAuthProvider } from '../providers/firebase-auth/firebase-auth';
import { FirebaseApiProvider } from '../providers/firebase-api/firebase-api';
import { VisitorPage } from '../pages/visitor/visitor';
import { FilterPage } from '../pages/filter/filter';
import { PreviewPage } from '../pages/preview/preview';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    SettingsPage,
    SignupPage,
    ForgotPasswordPage,
    RequestsPage,
    ProfilePage,
    ChatPage,
    ImagePage,
    MultiLoginPage,
    NationalityPage,
    DashboardPage,
    SellersPage,
    SellerDetailsPage,
    ViewedPage,
    RatedPage,
    ChatsPage,
    IntroPage,
    HomePage,
    TermsPage,
    PlacesPage,
    SetupPage,
    VisitorPage,
    FilterPage,
    PreviewPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
    }),
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    RatingModule,
    BrMaskerModule,
    HttpClientModule,
    ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    SettingsPage,
    SignupPage,
    ForgotPasswordPage,
    RequestsPage,
    ProfilePage,
    ChatPage,
    ImagePage,
    MultiLoginPage,
    NationalityPage,
    DashboardPage,
    SellersPage,
    SellerDetailsPage,
    ViewedPage,
    RatedPage,
    ChatsPage,
    IntroPage,
    HomePage,
    TermsPage,
    PlacesPage,
    SetupPage,
    VisitorPage,
    FilterPage,
    PreviewPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AngularFirestore,
    AngularFireAuth,
    AuthProvider,
    FeedbackProvider,
    DataProvider,
    Camera,
    WindowProvider,
    LocationProvider,
    Geolocation,
    MediaProvider,
    FirebaseAuthProvider,
    FirebaseApiProvider
  ]
})
export class AppModule { }
