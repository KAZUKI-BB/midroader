/* 「useState」と「useEffect」をimport↓ */
import React, {useState, useEffect} from "react";
/* 「onAuthStateChanged」,「signOut」と「auth」をimport↓ */
import { onAuthStateChanged , signOut } from "firebase/auth";
import {auth} from "../FirebaseConfig"
/* ↓「useNavigate」,「Navigate」をimport */
import { useNavigate, } from "react-router-dom";
import './Footer.css';

const Footer = () => {
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

    /* ↓「navigate」を定義 */
    const navigate = useNavigate();

    /* ↓関数「logout」を定義 */
    const logout = async () => {
        await signOut(auth);
        navigate("/login/");
    }

    return (
        <>
          {/* ↓「loading」がfalseのときにマイページを表示する設定 */}
          {! loading && (
            <>
              {/* ↓ログインしていない場合はログインページにリダイレクトする設定 */}
              {!user ? (
                <>
                  <footer></footer>
                </>
              ) : (
                <>
                    <footer>
                        <button onClick={logout} className="footer_logout">ログアウト</button>
                    </footer>
                </>
              )}
            </>
          )}
        </>
      );
}

export default Footer;