import React, { useContext, useState } from 'react';
import { ClassInfoContext } from '../context/ClassInfo';

const TestPage = () => {
    const { classInfo } = useContext(ClassInfoContext);
    const [selectedClass, setSelectedClass] = useState(null);

    const classes = classInfo.filter(record => 
        record.class_semester === 1 && record.class_dow === 1 && record.class_time === 3
    );

    const handleChange = e => {
        const classRecord = classes.find(record => record.class_name === e.target.value);
        setSelectedClass(classRecord);
    };

    return(
        <>
            <h1>TestPage</h1>
            {classes.length > 0 ? 
                <>
                    <select onChange={handleChange}>
                    <option value="">選択してください</option>
                        {classes.map((record, index) =>
                            <option key={index} value={record.class_name}>
                                {record.class_name}
                            </option>
                        )}
                    </select>
                    {selectedClass && <p>ID: {selectedClass.class_id}, Name: {selectedClass.class_name}</p>}
                </>
            : 
                <p>No classes found</p>
            }
        </>
    );
}

export default TestPage;




