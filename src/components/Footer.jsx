/* 「useState」と「useEffect」をimport↓ */
import React, {useState, useEffect} from "react";
/* 「onAuthStateChanged」,「signOut」と「auth」をimport↓ */
import { onAuthStateChanged } from "firebase/auth";
import {auth} from "../FirebaseConfig"
import { Link } from 'react-router-dom';

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
        setLoading(false);
      });
    },[]);

    return (
        <>
          {! loading && (
            <>
              {!user ? (
                <>
                  <footer></footer>
                </>
              ) : (
                <>
                    <footer>
                      <div className="footer_nav">
                        <ul>
                          <li><Link to="#"><span className="material-icons" style={{ fontSize: "48px" }}>chat</span></Link></li>
                          <li><Link to="/"><span className="material-icons" style={{ fontSize: "48px" }}>home</span></Link></li>
                          <li><Link to="/user"><span className="material-icons" style={{ fontSize: "48px" }}>account_circle</span></Link></li>
                        </ul>
                      </div>
                    </footer>
                </>
              )}
            </>
          )}
        </>
      );
}

export default Footer;