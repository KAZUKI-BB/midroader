import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../FirebaseConfig";
import { ClassInfoContext } from "../context/ClassInfo";
import "./TimeTable.css";

const TimeTable = () => {
  const [selectedDay, setSelectedDay] = useState("1");
  const [userTimetable, setUserTimetable] = useState({});
  const { classInfo } = useContext(ClassInfoContext);
  const termMapping = {
    true: "first_semester",
    false: "second_semester",
  };
  const dayMapping = {
    "1": "mon",
    "2": "tue",
    "3": "wed",
    "4": "thu",
    "5": "fri",
    "6": "sat",
  };

  const navigate = useNavigate();
  const [isFirstTerm, setIsFirstTerm] = useState(true);

  const toggleTerm = () => {
    setIsFirstTerm(!isFirstTerm);
  };

  useEffect(() => {
    const getData = async () => {
      const docRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "UserTimetable",
        "data"
      );
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const timetable = docSnap.data();
        setUserTimetable(timetable);
      } else {
        console.log("No such document!");
      }
    };

    getData();
  }, [isFirstTerm, selectedDay]);

  const getClassName = (class_id) => {
    return (
      classInfo.find((classItem) => classItem.class_id === class_id)?.class_name ||
      "講義情報なし"
    );
  };

  return (
    <>
      <h1>TimeTable</h1>
      <div className="timetable">
        <div className="term_toggle">
          <button
            className={isFirstTerm ? "firstTerm" : "secondTerm"}
            onClick={toggleTerm}
          >
            {isFirstTerm ? "前期" : "後期"}
          </button>
        </div>

        <div className="day_of_week">
          <ul>
            <li>
              <input
                type="radio"
                name="day_of_week"
                value="1"
                id="mon"
                checked={selectedDay === "1"}
                onChange={() => setSelectedDay("1")}
              />
              <label htmlFor="mon">月</label>
            </li>
            <li>
              <input
                type="radio"
                name="day_of_week"
                value="2"
                id="tue"
                checked={selectedDay === "2"}
                onChange={() => setSelectedDay("2")}
              />
              <label htmlFor="tue">火</label>
            </li>
            <li>
              <input
                type="radio"
                name="day_of_week"
                value="3"
                id="wed"
                checked={selectedDay === "3"}
                onChange={() => setSelectedDay("3")}
              />
              <label htmlFor="wed">水</label>
            </li>
            <li>
              <input
                type="radio"
                name="day_of_week"
                value="4"
                id="thu"
                checked={selectedDay === "4"}
                onChange={() => setSelectedDay("4")}
              />
              <label htmlFor="thu">木</label>
            </li>
            <li>
              <input
                type="radio"
                name="day_of_week"
                value="5"
                id="fri"
                checked={selectedDay === "5"}
                onChange={() => setSelectedDay("5")}
              />
              <label htmlFor="fri">金</label>
            </li>
            <li>
              <input
                type="radio"
                name="day_of_week"
                value="6"
                id="sat"
                checked={selectedDay === "6"}
                onChange={() => setSelectedDay("6")}
              />
              <label htmlFor="sat">土</label>
            </li>
          </ul>
        </div>
        <div className="class_time">
          <ul>
            {["1", "2", "3", "4", "5"].map((period) => {
              const term = termMapping[isFirstTerm];
              const day = dayMapping[selectedDay];
              const classId = userTimetable[term]?.[day]?.[`period_${period}`];
              const className = getClassName(classId);
              return (
                <li key={period}>
                  <label>{period}</label>
                  <div className="class_info">
                    <p>{className}</p>
                    <button
                      onClick={() =>
                        navigate("/usertableregister", {
                          state: { term: isFirstTerm, day: selectedDay, period: period },
                        })
                      }
                    >
                      編集
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default TimeTable;


