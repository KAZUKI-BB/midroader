import React, { useState, useEffect } from "react";
import{
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { auth } from "../FirebaseConfig";
import { Navigate, Link } from "react-router-dom";

const Register = () => {
  // ユーザーネーム用のstate変数を追加
  const [username, setUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  
  // Submit時の処理でユーザーネームも追加
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      // ユーザーネームを設定
      if(user){
        await updateProfile(auth.currentUser, { displayName: username });
      } 
    } catch(error){
      alert("正しく入力してください");
    }
  };

  const [user, setUser] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return (
    <>
      {user ? (
        <Navigate to={`/`} />
      ) : (
        <>
          <h1>NewUser</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label>UserName</label>
              <input
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label>Mail</label>
              <input
                name="email"
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
            </div>
            <div>
              <label>Password</label>
              <input
                name="password"
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
            </div>
            <button type="submit">登録する</button>
            <p>ログインは<Link to={`/login/`}>こちら</Link></p>
          </form>
        </>
      )}
    </>
  );
};

export default Register;
