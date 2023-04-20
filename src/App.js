import './App.css';
import React, { useState, useEffect } from 'react';
import Header from './Components/Header';
import { Button } from 'react-bootstrap';

function App() {
  const [numRecords, setNumRecords] = useState(100);
  const [data, setData] = useState([]);
  const [showAllData, setShowAllData] = useState(false);
  const [prevNumRecords, setPrevNumRecords] = useState(null);

  useEffect(() => {
    async function getData() {
      const get = await fetch(`https://hub.dummyapis.com/employee?noofRecords=${showAllData ? data.length : numRecords}&idStarts=1001`);

      const res = await get.json();

      setData(res);
    }

    getData();
    document.title = `${numRecords} Employee Online`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numRecords, showAllData]);

  function handleClearInput() {
    setNumRecords(""); // Set numRecords to a default value
    setData([]);
    setPrevNumRecords(null);
  }

  function handleShowAll() {
    if (showAllData) {
      setNumRecords(prevNumRecords || 100); // Show previously displayed number of records or default value of 100
      setPrevNumRecords(null);
      setShowAllData(false);
    } else {
      setPrevNumRecords(numRecords); // Save current numRecords as prevNumRecords
      setShowAllData(true);
    }
  }

  function handleShowLess() {
    const halfDataLength = Math.ceil(data.length / 2);

    if (numRecords <= halfDataLength || showAllData) {
      setShowAllData(false);
      setNumRecords(Math.max(numRecords - halfDataLength, 0)); // Ensures numRecords doesn't go negative
    } else {
      setNumRecords(Math.max(numRecords - halfDataLength, 0));
    }
  }

  function renderDataItems() {
    if (data && Array.isArray(data) && data.length > 0) {
      const displayedData = data.slice(0, numRecords);

      return displayedData.map((element, index) => (
        <div className='data' key={index} style={{ fontFamily: "Courier New" }}>
          <h2>{index + 1}. {element.firstName} {element.lastName}</h2>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: "5px" }}>
            <div style={{ flexBasis: "35%" }}>
              <p>Contact Number:</p>
            </div>
            <div style={{ flexBasis: "60%", textAlign: "right" }}>
              <p>{element.contactNumber}</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <div style={{ flexBasis: "35%" }}>
              <p>Email:</p>
            </div>
            <div style={{ flexBasis: "60%", textAlign: "right" }}>
              <p>{element.email}</p>
            </div>
          </div>
        </div>
      ));
    } else {
      return <p>No Data Available</p>;
    }
  }

  return (
    <div>
      <Header />
      <div className="button-container">
        <input
          type="number"
          value={numRecords}
          onChange={(e) => setNumRecords(e.target.value)}
          className="input"
        />
        <Button variant="primary" onClick={() => setNumRecords(numRecords)} className="button">
          Get Employees
        </Button>
        <Button variant="secondary" onClick={handleClearInput} className="button">
          Clear
        </Button>
        <Button onClick={handleShowAll} className="button">
          Show all
        </Button>
        <Button onClick={handleShowLess} className="button">
          Show less
        </Button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gridGap: "20px" }}>
        {renderDataItems()}
      </div>
    </div>
  );
}

export default App;
