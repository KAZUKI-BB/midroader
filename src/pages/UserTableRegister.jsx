import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './UserPage.css';
import { ClassInfoContext } from '../context/ClassInfo';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../FirebaseConfig';


// mapping for term, day and period
const termMapping = {
  1: 'first_semester',
  2: 'second_semester'
};

const dayMapping = {
  1: 'mon',
  2: 'tue',
  3: 'wed',
  4: 'thu',
  5: 'fri',
  6: 'sat'
};

const periodMapping = {
  1: 'period_1',
  2: 'period_2',
  3: 'period_3',
  4: 'period_4',
  5: 'period_5'
};

const UserTableRegister = () => {
    const { classInfo } = useContext(ClassInfoContext);
    const [selectedClass, setSelectedClass] = useState(null);
    const [userTimetable, setUserTimetable] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    const { term, day, period } = location.state || {};
    let term_num = term ? 1 : 2;
    let day_num = parseInt(day);
    let period_num = parseInt(period);

    const classes = classInfo.filter(record =>
        record.class_semester === term_num && record.class_dow === day_num && record.class_time === period_num
    );

    const handleChange = e => {
        const classRecord = classes.find(record => record.class_name === e.target.value);
        setSelectedClass(classRecord);
    };

    useEffect(() => {
        const getData = async () => {
          const docRef = doc(db, 'users', auth.currentUser.uid, 'UserTimetable', 'data');
          const docSnap = await getDoc(docRef);
    
          if (docSnap.exists()) {
            const timetable = docSnap.data();

            setUserTimetable(timetable);
    
            const termString = termMapping[term_num];
            const dayString = dayMapping[day_num];
            const periodString = periodMapping[period_num];
            const classId = timetable[termString]?.[dayString]?.[periodString];
    
            // If a class_id is set, find the corresponding class info and set it
            if (classId) {
              const classRecord = classInfo.find(record => record.class_id === classId);
              setSelectedClass(classRecord);
            }
          } else {
            console.log("No such document!");
          }
        }
    
        getData();
      }, [classInfo, term_num, day_num, period_num]);  // Added dependencies
      
    const handleRegister = async() => {
        if(selectedClass) {
            const termString = termMapping[term_num];
            const dayString = dayMapping[day_num];
            const periodString = periodMapping[period_num];
    
            const updatedTimetable = { ...userTimetable };
    
            // Check if termString exists
            if(!updatedTimetable[termString]) updatedTimetable[termString] = {};
    
            // Check if dayString exists
            if(!updatedTimetable[termString][dayString]) updatedTimetable[termString][dayString] = {};
    
            // Directly assign class_id. Create periodString if doesn't exist.
            updatedTimetable[termString][dayString][periodString] = selectedClass.class_id;
    
            // Refer to the document 'data' under the subcollection 'UserTimetable' of the user's document in the 'users' collection
            const docRef = doc(db, 'users', auth.currentUser.uid, 'UserTimetable', 'data');
    
            // Use setDoc to create new document 'data' if it doesn't exist OR update it if it already exists
            await setDoc(docRef, updatedTimetable, { merge: true });
            setUserTimetable(updatedTimetable);
            navigate('/'); 
        }
    };
    
    return(
        <>
            <h1>TestPage</h1>
            {classes.length > 0 ?
                <>
                  <select value={selectedClass?.class_name || ""} onChange={handleChange}>
                      <option value="">選択してください</option>
                      {classes.map((record, index) =>
                          <option key={index} value={record.class_name}>
                              {record.class_name}
                          </option>
                      )}
                  </select>
                    {selectedClass && <p>ID: {selectedClass.class_id}, Name: {selectedClass.class_name}</p>}
                    <button onClick={handleRegister}>登録</button>
                </>
            :
                <p>講義情報はありません</p>
            }
        </>
    );
};

export default UserTableRegister;


