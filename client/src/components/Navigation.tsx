import React from 'react';

const Navigation = () => {
  return (
    <div id="nav">
      <a href="./pages/Home">
        <div id="cur" className="tab">
          <h3>Home</h3>
        </div>
      </a>

      <div id="right">
        <div className="tab">
          <h3>Watch</h3>
        </div>
        <div className="tab">
          <h3>Talk</h3>
        </div>
        <a href="https://e1064b62-adf8-4f83-a529-2998e26b9199-00-39fd6q53vpp5t.riker.replit.dev/">
          <div className="tab">
            <h3>Learn</h3>
          </div>
        </a>
        <div className="drop">
          <a href="https://fe59087e-7352-40cf-87b2-ccdb0ce4aac8-00-3ueu7dt9jutuh.janeway.replit.dev/">Lesson</a>
          <a href="#">Stories</a>
          <a href="#">Games</a>
          <a href="#">Characters</a>
          <a href="#">Fun Facts</a>
          <a href="#">History</a>
          <a href="https://8dae80f4-ef92-4d80-b4f1-c2dd4a56d3a5-00-2jb6dt6j3umq4.picard.replit.dev/">Resources</a>
        </div>
      </div>

      <div className="tab">
        <h3>Img</h3>
      </div>
    </div>
  );
};

export default Navigation;
