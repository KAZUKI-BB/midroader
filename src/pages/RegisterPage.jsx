import React, { useState, useEffect, useContext } from "react";
import{
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { auth } from "../FirebaseConfig";
import { Navigate, Link } from "react-router-dom";
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import { FacultyContext } from '../context/FacultyInfo';

const Register = () => {
  const [username, setUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [zemi, setZemi] = useState("選択なし");
  const [grade, setGrade] = useState("1");
  const [job, setJob] = useState("指定なし");
  const [faculty, setFaculty] = useState("1011"); // initial value

  const facultyData = useContext(FacultyContext); // get faculty data from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      if(user){
        await updateProfile(auth.currentUser, { displayName: username });
      
        // ユーザー情報の保存
        await setDoc(doc(db, 'users', user.uid), {
          zemi: zemi,
          grade: grade,
          job: job,
          faculty: faculty
        });

        const initialTimeTable = {
          first_semester: {
            mon: {period_1: 0, period_2: 0, period_3: 0, period_4: 0, period_5: 0},
            tue: {period_1: 0, period_2: 0, period_3: 0, period_4: 0, period_5: 0},
            wed: {period_1: 0, period_2: 0, period_3: 0, period_4: 0, period_5: 0},
            thu: {period_1: 0, period_2: 0, period_3: 0, period_4: 0, period_5: 0},
            fri: {period_1: 0, period_2: 0, period_3: 0, period_4: 0, period_5: 0},
            sat: {period_1: 0, period_2: 0, period_3: 0, period_4: 0, period_5: 0}
          },
          second_semester: {
            mon: {period_1: 0, period_2: 0, period_3: 0, period_4: 0, period_5: 0},
            tue: {period_1: 0, period_2: 0, period_3: 0, period_4: 0, period_5: 0},
            wed: {period_1: 0, period_2: 0, period_3: 0, period_4: 0, period_5: 0},
            thu: {period_1: 0, period_2: 0, period_3: 0, period_4: 0, period_5: 0},
            fri: {period_1: 0, period_2: 0, period_3: 0, period_4: 0, period_5: 0},
            sat: {period_1: 0, period_2: 0, period_3: 0, period_4: 0, period_5: 0}
          }
        };

        await setDoc(doc(db, 'users', user.uid, 'UserTimetable', 'data'), initialTimeTable);
      }
    } catch(error){
      alert("正しく入力してください");
    }
  };

  const [user, setUser] = useState();
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
              <label>ゼミ</label>
              <select
                value={zemi}
                onChange={(e) => setZemi(e.target.value)}
              >
                <option>選択なし</option>
                <option>ゼミ1</option>
                <option>ゼミ2</option>
                <option>ゼミ3</option>
              </select>
            </div>
            <div>
              <label>学年</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              >
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
              </select>
            </div>
            <div>
              <label>目標の職業</label>
              <select
                value={job}
                onChange={(e) => setJob(e.target.value)}
              >
                <option>指定なし</option>
                <option>通信</option>
                <option>建設</option>
                <option>製造</option>
                <option>運輸</option>
                <option>電気ガス</option>
                <option>卸売小売</option>
                <option>金融</option>
                <option>保険</option>
                <option>不動産</option>
                <option>サービス</option>
                <option>公務員</option>
              </select>
            </div>
            <div>
              <label>学部・学科・コース</label>
              <select
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
              >
                {facultyData.map(({faculty_id, faculty_name, faculty_department, faculty_course}) => (
                  <option key={faculty_id} value={faculty_id}>
                    {faculty_name}/{faculty_department}/{faculty_course || ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Email</label>
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
            <button type="submit">Register</button>
            <p>You have an account? <Link to={`/login/`}>Login</Link></p>
          </form>
        </>
      )}
    </>
  );
};

export default Register;




