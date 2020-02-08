import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { COLLECTION } from '../../utils/consts';


@Injectable()
export class FirebaseApiProvider {
  firebaseRef = firebase.database();
  constructor(public afAuth: AngularFireAuth) {
  }

  addItem(ref: string, item: any): Promise<any> {
    const dataRef = this.firebaseRef.ref(`/${ref}/${item.uid}`);
    return dataRef.set(item);
  }

  getItem(ref: string, key: string): Promise<any> {
    return this.firebaseRef.ref(`/${ref}/${key}`).once('value', function (snapshot) { });
  }

  updateItem(ref: string, key: string, itemKeyValue): Promise<any> {
    const dataRef = this.firebaseRef.ref(`/${ref}`);
    return dataRef.child(key).update(itemKeyValue);
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

  capitalizeFirstLetter(str: string): string {
    return str ? str.charAt(0).toUpperCase() + str.substring(1) : str;
  }

}
