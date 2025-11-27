import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';

export const signup = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signupDistributor = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
}

export const signupDistributorWithData = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
}

export const updateDistributor = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
}

export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const authState = callback => {
  return onAuthStateChanged(auth, callback);
};

export const logout = () => {
  return signOut(auth);
};