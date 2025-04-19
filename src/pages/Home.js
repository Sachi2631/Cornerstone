import React from 'react';
import './App.css';
import Navigation from "../components/navigation";


function App() {
  return (
    <div>
      <div component="navigation">
        <h1>to-be-navigation bar</h1>
      </div>

      <div id="center">
        <div id="title">
          <h1 id="header">Nihon-go!</h1>
          <p>Learn Japanese!</p>
        </div>
        <br />

        <div id="buttons">
          <div style={{ paddingLeft: '15vw' }} className="row">
            <a href="#">
              <button className="jump">Log in</button>
            </a>
            <a href="#info">
              <button className="jump">Learn more</button>
            </a>
          </div>
        </div>

        <div id="fact">
          <img id="cat" src="https://www.freeiconspng.com/thumbs/cat-icon/cat-icon-25.png" alt="Cat"/>
          <div id="cat-text">
            <h3>Shinjuku</h3>
            <p>This is Shinjuku! It's the capital of Tokyo Prefecture.</p>
          </div>
        </div>
      </div>

      <div id="info">
        <br />
        <div className="box">
          <h3 className="header">About us!</h3>
          <p>
          Many language learning programs exist – but many aren’t fun,
          interesting, engaging, and don't teach necessary and real-world useful
          topics or phrases. In fact, some even teach very unpractical phrases
          that you might never use. Our goal is
          to create a website or guide that teaches you how to learn 
          practical Japanese that will be useful to you in everyday life, 
          and will enable you to live comforably and thrive in Japan. You can 
          learn emergency medical, finance, or law-related terminology, 
        as well as everyday and work phrases.  
          </p>
          <br />
          <p>
            Our names are Sara and Sachi, sophomores in KLS, and our purpose is
            to create a website for language learners – people who want to learn
            for fun, and learn useful things in an efficient, interesting, free,
            and fun way! We have added many features so you can learn Japanese
            while learning as much as you enjoy it! You will also learn not only
            just the language but some culture as well – for example, some major
            interesting and fun music, events, games, and movies important in
            Japan.
          </p>
        </div>

        <div className="box">
          <h3 className="header">Contact us!</h3>
          <p>
            Don't hesitate to reach out if you have any feedback, questions,
            concerns, or new ideas! Thanks!!
          </p>
        </div>

        <br />
        <br />
      </div>

      <div component="footer">
        <h1>to-be-footer bar</h1>
      </div>
    </div>
  );
}

export default App;