import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VUE_APP_F_API_KEY || "",
  authDomain: process.env.VUE_APP_F_AUTH_DOMAIN || "",
  databaseURL: process.env.VUE_APP_F_DB_URL || "",
  projectId: process.env.VUE_APP_F_PROJECT_ID || "",
  storageBucket: process.env.VUE_APP_F_STORAGE_BUCKET || "",
  messagingSenderId: process.env.VUE_APP_F_MESSAGING_SENDER_ID || "",
  appId: process.env.VUE_APP_F_APP_ID || "",
  measurementId: process.env.VUE_APP_F_MEASUREMENT_ID || ""
};
firebase.initializeApp(firebaseConfig);
// let's not enable ga by default.
//const analytics = firebase.analytics();
const store = firebase.firestore();
const auth = firebase.auth();

type User = {
  displayName: string;
};

const user = {
  debug: true,
  state: {
    user: null as any
  },
  setMessageAction(u: User) {
    this.state.user = u;
  },
  clearMessageAction() {
    this.state.user = null;
  }
};

auth.onAuthStateChanged(function(u) {
  if (!u) {
    user.state.user = null;
    return;
  }
  user.state.user = {
    displayName: u?.displayName,
    email: u?.email,
    emailVerified: u?.emailVerified,
    photoURL: u?.photoURL,
    isAnonymous: u?.isAnonymous,
    uid: u?.uid,
    providerdata: u?.providerData
  };
});

export { store, auth, user };
