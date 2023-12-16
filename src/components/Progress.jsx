import React, { useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../FirebaseConfig';
import './Progress.css';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import { ClassInfoContext } from "../context/ClassInfo";
import { Doughnut } from 'react-chartjs-2';
import { ArcElement, Chart, CategoryScale, DoughnutController } from 'chart.js';

Chart.register(ArcElement, CategoryScale, DoughnutController);

const jobMapping = {
  '通信': 1,
  '建設': 2,
  '製造': 3,
  '運輸': 4,
  '電気ガス': 5,
  '卸売小売': 6,
  '金融': 7,
  '保険': 8,
  '不動産': 9,
  'サービス': 10,
  '公務員': 11
};

const Progress = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState('');
  const [job_num, setJob_num] = useState(0);
  const [user_classes, setUserClasses] = useState([]);
  const { classInfo } = useContext(ClassInfoContext);
  const [matchedClasses, setMatchedClasses] = useState(0);
  const [totalClassesForJob, setTotalClassesForJob] = useState(0);

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const promises = [];

        const docUserRef = doc(db, 'users', currentUser.uid);
        promises.push(
          getDoc(docUserRef).then((docUserSnap) => {
            if (docUserSnap.exists()) {
              const jobDB = docUserSnap.data().job;
              setJob(jobDB);
              setJob_num(jobMapping[jobDB]);
            } else {
              console.log('No such document!');
            }
          })
        );

        const docTimeTableRef = doc(db, 'users', currentUser.uid, 'UserTimetable', 'data');
        promises.push(
          getDoc(docTimeTableRef).then((docTimeTableSnap) => {
            if (docTimeTableSnap.exists()) {
              const timetable = docTimeTableSnap.data();
              let classIds = [];
              for (let semester in timetable) {
                for (let day in timetable[semester]){
                  for(let period in timetable[semester][day]){
                    classIds.push(timetable[semester][day][period]);
                  }
                }
              }
              setUserClasses(classIds);
            } else {
              console.log('No such TimeTable document!');
            }
          })
        );

        Promise.all(promises).then(() => setLoading(false));
      }
    });
  }, []);

  useEffect(() => {
    if (!loading && classInfo.length) {
      const allJobs = classInfo.map(classItem => classItem.class_connection_job);
      console.log("All Class Connection Jobs: ", allJobs);
    }
  }, [loading, classInfo]);

  useEffect(() => {
    if (!loading && classInfo.length && job_num !== 0) { 
      const matchedClassesCount = classInfo.reduce((count, classItem) => {
        const includesJobNum = Array.isArray(classItem.class_connection_job) ?
        classItem.class_connection_job.some(job => job === job_num) :
        classItem.class_connection_job === job_num;
        if (classItem && includesJobNum && user_classes.includes(classItem.class_id)) {
          return count + 1;
        } else {
          return count;
        }
      }, 0);
      setMatchedClasses(matchedClassesCount);

      const totalClassesCount = classInfo.reduce((count, classItem) => {
        const includesJobNum = Array.isArray(classItem.class_connection_job) ?
        classItem.class_connection_job.some(job => job === job_num) :
        classItem.class_connection_job === job_num;
        if (classItem && includesJobNum) {
          return count + 1;
        } else {
          return count;
        }
      }, 0);
      setTotalClassesForJob(totalClassesCount);
    }
  }, [loading, classInfo, job_num, user_classes]);

  const data = {
    labels: ['Taken Job-related Classes', 'Total Job-related Classes'],
    datasets: [
      {
        data: [matchedClasses, totalClassesForJob - matchedClasses],
        backgroundColor: ['#ed3902', '#f7d2b0'],
        hoverBackgroundColor: ['#ed3902', '#f7d2b0']
      }
    ]
  };

  return (
    <>
      {!loading && user && (
        <div className='progress_container'>
          <div className='progress_graph'>
            <Doughnut data={data} />
          </div>
          <div className='progress_info'>
            <p>選択した職種：{job}</p>
            <p>「{job}」に関連する講義：{totalClassesForJob}件</p>
            <p>履修した「{job}」に関連する講義：{matchedClasses}件</p>
            <p className="achievement_rate">達成率：{(matchedClasses / totalClassesForJob * 100).toFixed(1)}%</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Progress;