import React from 'react';
import './App.css';
import Navigation from "../components/navigation";


function App() {
  return (
    <div>
      <div component="navigation">
        <h1>to-be-navigation bar</h1>
      </div>

          <h1 id="header">Dashboard</h1>

          <img id="map" src="https://vemaps.com/uploads/img/jp-04.png" />

      <div id="info">
    
        <div className="box">
          <h3 className="header">Contact us!</h3>
          <p>
            Don't hesitate to reach out if you have any feedback, questions,
            concerns, or new ideas! Thanks!!
          </p>
        </div>
      </div>

      <div component="footer">
        <h1>to-be-footer bar</h1>
      </div>
    </div>
  );
}

export default App;