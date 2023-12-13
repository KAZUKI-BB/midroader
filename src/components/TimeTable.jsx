import { useState } from "react";
import "./TimeTable.css";
import ClassTime from "./ClassTime";

const TimeTable = () => {
  const [selectedDay, setSelectedDay] = useState("1");
  
  // セメスター状態の追加 (trueで前期、falseで後期)
  const [isFirstTerm, setIsFirstTerm] = useState(true);

  // セメスター切り替えの関数
  const toggleTerm = () => {
    setIsFirstTerm(!isFirstTerm);
  };

  return (
    <>
      <h1>TimeTable</h1>
      <div className="timetable">
        <div className="term_toggle">
          <button className={isFirstTerm ? "firstTerm" : "secondTerm"} onClick={toggleTerm}>
            {isFirstTerm ? "前期" : "後期"}
          </button>
        </div>

        <div className="day_of_week">
          <ul>
            <li><input type="radio" name="day_of_week" value="1" id="mon" checked={selectedDay === "1"} onChange={() => setSelectedDay("1")}/><label htmlFor="mon">月</label></li>
            <li><input type="radio" name="day_of_week" value="2" id="tue" checked={selectedDay === "2"} onChange={() => setSelectedDay("2")}/><label htmlFor="tue">火</label></li>
            <li><input type="radio" name="day_of_week" value="3" id="wed" checked={selectedDay === "3"} onChange={() => setSelectedDay("3")} /><label htmlFor="wed">水</label></li>
            <li><input type="radio" name="day_of_week" value="4" id="thu" checked={selectedDay === "4"} onChange={() => setSelectedDay("4")}/><label htmlFor="thu">木</label></li>
            <li><input type="radio" name="day_of_week" value="5" id="fri" checked={selectedDay === "5"} onChange={() => setSelectedDay("5")}/><label htmlFor="fri">金</label></li>
            <li><input type="radio" name="day_of_week" value="6" id="sat" checked={selectedDay === "6"} onChange={() => setSelectedDay("6")}/><label htmlFor="sat">土</label></li>
          </ul>
        </div>
        <ClassTime />
      </div>
    </>
  );
};

export default TimeTable;
