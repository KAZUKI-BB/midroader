import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../FirebaseConfig";
import { useNavigate, Navigate } from "react-router-dom";
import './UserPage.css';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../FirebaseConfig';

const User = () => {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [zemi, setZemi] = useState("");
  const [grade, setGrade] = useState("");
  const [job, setJob] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setZemi(docSnap.data().zemi);
          setGrade(docSnap.data().grade);
          setJob(docSnap.data().job);
        } else {
          console.log("No such document!");
        }
      }
      setLoading(false);
    });
  }, []);

  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/login/");
  }

  return(
    <>
      {! loading && (
        <>
          {!user ? (
            <Navigate to={'/login/'} />
          ) : (
          <>
            <h1>UserInfo</h1>
            <p>Name: {user.displayName}</p>
            <p>Email: {user.email}</p>
            <p>ゼミ: {zemi}</p>
            <p>学年: {grade}</p>
            <p>目標の職業:{job}</p>
            <button onClick={() => navigate('/user/edit')}>ユーザー情報編集</button>
            <button onClick={logout} className="footer_logout">ログアウト</button>
          </>
          )}
        </>
      )}
    </>
  );
};

export default User;