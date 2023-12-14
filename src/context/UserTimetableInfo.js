import React, { createContext, useState, useEffect } from "react";
import firebase from "../firebase";

export const UserTimetableContext = createContext();

export const UserTimetableProvider = ({ children }) => {
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection('UserTimetable')
      .onSnapshot((snapshot) => {
        const newTimetable = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setTimetable(newTimetable);
      })
    return () => unsubscribe();
  }, [])

  return (
    <UserTimetableContext.Provider value={timetable}>
      { children }
    </UserTimetableContext.Provider>
  )
}