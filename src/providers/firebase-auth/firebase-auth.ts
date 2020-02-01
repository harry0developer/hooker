import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
// import { AngularFireAuth } from 'angularfire2/aauth';
// import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { User } from '../../models/user';
import { STORAGE_KEY } from '../../utils/consts';

 
@Injectable()
export class FirebaseAuthProvider {

  private user: Observable<User>;

  constructor( private afAuth: AngularFireAuth, private afs: AngularFirestore ) {
    this.user = this.afAuth.authState.switchMap(user => {
      if (user) {
        return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
      } else {
        // logged out, null
        return Observable.of(null)
      }
    });
  } 
  
  signupWithEmailAndPassword(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  } 


  updateUser(id: string, user: User) { 
    return this.afs.doc(`users/${id}`).update(user);
  }
 
  setUserDoc(id: string, user: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${id}`);
    return userRef.set(user);
  }

  getCurrentUser(): Observable<User> {
    return this.user;
  }

}