import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

import { AngularFireAuth } from '@angular/fire/auth';
import { STORAGE_KEY } from '../../utils/consts';
import { User } from '../../models/user';


@Injectable()
export class FirebaseApiProvider {
  firebaseRef = firebase.database();
  constructor(public afAuth: AngularFireAuth) {
  }

  getLoggedInUser(): User {
    return this.getItemFromLocalStorage(STORAGE_KEY.user);
  }


  addItem(ref: string, item: any): Promise<any> {
    const dataRef = this.firebaseRef.ref(`/${ref}/${item.uid}`);
    return dataRef.set(item);
  }

  addItemWithKey(ref: string, key: string, item: any): Promise<any> {
    const dataRef = this.firebaseRef.ref(`/${ref}/${key}`);
    return dataRef.set(item);
  }

  addImageToRealtimeDB(ref: string, img, imgRef: string): Promise<any> {
    const dataRef = this.firebaseRef.ref(`/${ref}/${imgRef}`);
    return dataRef.set(img);
  }

  getItem(ref: string, key: string): Promise<any> {
    return this.firebaseRef.ref(`/${ref}/${key}`).once('value', snap => snap);
  }

  updateItem(ref: string, uid: string, itemKeyValue: any): Promise<any> {
    const dataRef = this.firebaseRef.ref(`/${ref}`);
    return dataRef.child(uid).update(itemKeyValue);
  }


  removeItem(ref: string, key: string): Promise<any> {
    const dataRef = this.firebaseRef.ref(`/${ref}`);
    return dataRef.child(key).remove()
  }

  deleteTask(ref: string, key: string) {
    const dataRef = this.firebaseRef.ref(`/${ref}`);;
    dataRef.child(key).remove();
  }


  signupWithEmailAndPassword(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  getItemFromLocalStorage(key: string): any {
    const data = localStorage.getItem(key);
    if (!data || data === 'undefined' || data === null || data === undefined) {
      return {};
    } else {
      return JSON.parse(data);
    }
  }

  addItemToLocalStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

}
