import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class FirebaseApiProvider {
  constructor() {
  }
 
  addItem(ref: string, item: any): Promise<any> {
    const firebaseDBRef = firebase.database().ref(`/${ref}`);
    return firebaseDBRef.push(item);
  }

  updateItem(ref: string, key: string, itemKeyValue): Promise<any> {
    const firebaseDBRef = firebase.database().ref(`/${ref}`);
    return firebaseDBRef.child(key).update(itemKeyValue);
  }

  removeItem(ref: string, key: string): Promise<any> {
    const firebaseDBRef = firebase.database().ref(`/${ref}`);
    return firebaseDBRef.child(key).remove()
  }

  deleteTask(ref: string, key: string) {
    const firebaseDBRef = firebase.database().ref(`/${ref}`);
    firebaseDBRef.child(key).remove();
  }
}
