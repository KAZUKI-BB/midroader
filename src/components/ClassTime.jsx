import "./ClassTime.css";

const TimeTable = () => {

    return (
        <>
          <div className="class_time">
            <ul>
              <li>
                <label>1</label>
                <div className="class_info" id="1"></div>
              </li>
              <li>
                <label>2</label>
                <div className="class_info" id="2"></div>
              </li>
              <li>
                <label>3</label>
                <div className="class_info" id="3"></div>
              </li>
              <li>
                <label>4</label>
                <div className="class_info" id="4"></div>
              </li>
              <li>
                <label>5</label>
                <div className="class_info" id="5"></div>
              </li>
            </ul>
          </div>
        </>
    );
}

export default TimeTable;