import React, { useState, useEffect, useContext } from "react";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { auth } from "../FirebaseConfig";
import { db } from "../FirebaseConfig";
import { useNavigate } from "react-router-dom";
import { FacultyContext } from '../context/FacultyInfo';
import "./AuthPage.css";

const UserEdit = () => {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [zemi, setZemi] = useState("選択なし");
  const [grade, setGrade] = useState("1");
  const [job, setJob] = useState("指定なし");
  const [faculty, setFaculty] = useState("1011"); // initial value
  const facultyData = useContext(FacultyContext); // get faculty data from context

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName);
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setZemi(docSnap.data().zemi);
          setGrade(docSnap.data().grade);
          setJob(docSnap.data().job); // Get job from Firestore
          setFaculty(docSnap.data().faculty); // Get faculty from Firestore
        } else {
          console.log("No such document!");
        }
      }
      setLoading(false);
    });
  }, []);

  const navigate = useNavigate();

  const save = async () => {
    await updateProfile(auth.currentUser, { displayName });
    const userDoc = doc(db, 'users', auth.currentUser.uid);
    await setDoc(userDoc, { zemi, grade, job, faculty }, { merge: true });
    navigate("/user");
  };

  return (
    <>
      {!loading && user ? (
        <div>
          <h1>User Info Edit</h1>
          <div className="user_operation">
            <label>Name: </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div  className="user_operation">
            <label>Zemi: </label>
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
          <div className="user_operation">
            <label>Grade: </label>
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
          <div className="user_operation">
            <label>Job: </label>
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
          <div className="user_operation">
            <label>Faculty: </label>
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
          <button className="function_btn" onClick={save}>Save</button>
        </div>
      ) : (
        "Loading..."
      )}
    </>
  );
};

export default UserEdit;




