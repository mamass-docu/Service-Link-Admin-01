import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import store from "../state/store";
import { setLoading, setSpecificLoading } from "../state/globalsSlice";

const loadingProcess = async (processFun, errorFun) => {
  try {
    store.dispatch(setLoading(true));
    await processFun();
  } catch (e) {
    console.log(e);
    if (errorFun) errorFun(e);
    else alert(e);
  } finally {
    store.dispatch(setLoading(false));
  }
};

const specificLoadingProcess = async (processFun, errorFun) => {
  try {
    store.dispatch(setSpecificLoading(true));
    await processFun();
  } catch (e) {
    console.log(e);
    if (errorFun) errorFun(e);
    else alert(e);
  } finally {
    store.dispatch(setSpecificLoading(false));
  }
};

const find = async (collectionName, uid) => {
  return await getDoc(doc(db, collectionName, uid));
};

const all = async (collectionName) => {
  return await getDocs(collection(db, collectionName));
};

const get = async (collectionName, ...whereCond) => {
  return await getDocs(query(collection(db, collectionName), ...whereCond));
};

const set = async (collectionName, uid, data) => {
  return await setDoc(doc(db, collectionName, uid), data, { merge: true });
};

const add = async (collectionName, data) => {
  return await addDoc(collection(db, collectionName), data);
};

const update = async (collectionName, uid, data) => {
  await updateDoc(doc(db, collectionName, uid), data);
};

const remove = async (collectionName, uid) => {
  await deleteDoc(doc(db, collectionName, uid));
};

export {
  loadingProcess,
  specificLoadingProcess,
  get,
  all,
  find,
  add,
  set,
  update,
  remove,
  where,
  serverTimestamp,
};
