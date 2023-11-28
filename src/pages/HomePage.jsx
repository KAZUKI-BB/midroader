/* 「useState」と「useEffect」をimport↓ */
import React, {useState, useEffect} from "react";
/* 「onAuthStateChanged」,「signOut」と「auth」をimport↓ */
import { onAuthStateChanged } from "firebase/auth";
import {auth} from "../FirebaseConfig"
/* ↓「useNavigate」,「Navigate」をimport */
import { Navigate } from "react-router-dom";


const Home = () => {
  /* ↓state変数「user」を定義 */
  const [user, setUser] = useState("");
  /* ↓state変数「loading」を定義 */
  const[loading, setLoading] = useState(true);

  /* ↓ログインしているかどうかを判定する */
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) =>{
      setUser(currentUser);
      /* ↓追加 */
      setLoading(false);
    });
  },[]);

  return (
    <>
      {/* ↓「loading」がfalseのときにマイページを表示する設定 */}
      {! loading && (
        <>
          {/* ↓ログインしていない場合はログインページにリダイレクトする設定 */}
          {!user ? (
            <Navigate to={'/login/'} />
          ) : (
            <>
              <h1>マイページ</h1>
              {/* ↓ユーザーのメールアドレスを表示（ログインしている場合） */}
              <p>{user?.email}</p>
            </>
          )}
        </>
      )}


    </>
  );
};

export default Home;