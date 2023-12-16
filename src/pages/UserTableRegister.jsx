import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './UserTableRegister.css';
import { ClassInfoContext } from '../context/ClassInfo';
import { arrayUnion, doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../FirebaseConfig';

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
    const [review, setReview] = useState("");
    const [reviews, setReviews] = useState([]);
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

    const handleSubmitReview = async () => {
      if (selectedClass && review !== "" && selectedClass.class_name !== '履修登録なし') {
        const docRef = doc(db, 'review_classes', selectedClass.class_id.toString());
  
        await setDoc(docRef, {
          reviews: arrayUnion(review)
        }, {merge: true});

        setReview("");

        fetchReviewData(selectedClass.class_id); // Updating the review data after submission
      }
    };
    
    const fetchReviewData = async (classId) => {
      const docRef = doc(db, 'review_classes', classId.toString());
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();
        setReviews(data.reviews); //updating the reviews state
      } else {
        setReviews([]); //if there is no review, setting the reviews as empty array
      }
    }

  useEffect(() => {
    if (selectedClass) {
      fetchReviewData(selectedClass.class_id);
    }
  }, [selectedClass]);

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
    if(selectedClass && selectedClass.class_name !== '履修登録なし') {
      const termString = termMapping[term_num];
      const dayString = dayMapping[day_num];
      const periodString = periodMapping[period_num];

      const updatedTimetable = { ...userTimetable };

      if(!updatedTimetable[termString]) updatedTimetable[termString] = {};
      if(!updatedTimetable[termString][dayString]) updatedTimetable[termString][dayString] = {};

      updatedTimetable[termString][dayString][periodString] = selectedClass.class_id;

      const docRef = doc(db, 'users', auth.currentUser.uid, 'UserTimetable', 'data');
      await setDoc(docRef, updatedTimetable, { merge: true });
      setUserTimetable(updatedTimetable);
      navigate('/'); 
    } else {
      // If no class selected / "履修登録なし" selected
      const termString = termMapping[term_num];
      const dayString = dayMapping[day_num];
      const periodString = periodMapping[period_num];

      const updatedTimetable = { ...userTimetable };

      if(!updatedTimetable[termString]) updatedTimetable[termString] = {};
      if(!updatedTimetable[termString][dayString]) updatedTimetable[termString][dayString] = {};

      // Place the class_id as 0
      updatedTimetable[termString][dayString][periodString] = 0;

      const docRef = doc(db, 'users', auth.currentUser.uid, 'UserTimetable', 'data');
      await setDoc(docRef, updatedTimetable, { merge: true });
      setUserTimetable(updatedTimetable);
      navigate('/'); 
    }
  };

  return (
    <>
      {classes.length > 0 ?
        <>
            <select value={selectedClass?.class_name || "履修登録なし"} onChange={handleChange}>
              <option value="履修登録なし">履修登録なし</option>
              {classes.map((record, index) =>
                <option key={index} value={record.class_name}>
                  {record.class_name}
                </option>
              )}
            </select>
            {selectedClass && selectedClass.class_name !== '履修登録なし' && <div className='container'>
              <div >
                <h3>講義名</h3>
                <p>{selectedClass.class_name}</p>
                <h3>講師名</h3>
                <p>{selectedClass.class_teacher}</p>
                <h3>講義概要</h3>
                <p>{selectedClass.class_overview}</p>
                <h3>シラバス</h3>
                <a href={ selectedClass.class_url } target="_blank">シラバスを参照</a>
                <h3>口コミ</h3>
                {selectedClass.class_review && selectedClass.class_review.map((review, index) => <p key={index}>{review}</p>)}
                <div>
                  {reviews.map((review, index) => (
                    <div className='review_p' key={index}>
                      <p>{review}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>}
            { selectedClass && selectedClass.class_name !== '履修登録なし' &&
                <div className="review-container">
                    <input value={review} placeholder="口コミを投稿" onChange={(e) => setReview(e.target.value)} />
                    <button onClick={handleSubmitReview}><span className="material-icons" style={{ fontSize: "12px" }}>send</span></button>
                </div>
            }
            <button onClick={handleRegister}>登録</button>
        </>
      :
        <p>講義情報はありません</p>
      }
    </>
  );
};
export default UserTableRegister;



