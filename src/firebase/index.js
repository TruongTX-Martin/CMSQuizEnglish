import * as firebase from 'firebase';

const settings = { timestampsInSnapshots: true };

const config = {
  apiKey: 'AIzaSyDsHU-qqFd_f_EmcKw0S4r69emcK92hdmw',
  authDomain: 'quizenglishlistening.firebaseapp.com',
  databaseURL: 'https://quizenglishlistening.firebaseio.com',
  projectId: 'quizenglishlistening',
  storageBucket: 'quizenglishlistening.appspot.com',
  messagingSenderId: '185141496389'
};
firebase.initializeApp(config);

firebase.firestore().settings(settings);

export default firebase;
