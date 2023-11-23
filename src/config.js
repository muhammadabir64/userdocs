import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAvfCg-Moj4AIqcieOB8bVyS4fiAh804JQ",
  authDomain: "userdocs-74241.firebaseapp.com",
  projectId: "userdocs-74241",
  storageBucket: "userdocs-74241.appspot.com",
  messagingSenderId: "277457106792",
  appId: "1:277457106792:web:bffb55eb8b449e582dc8dd"
};

const app = initializeApp(firebaseConfig);

export default app;
export { firebaseConfig };