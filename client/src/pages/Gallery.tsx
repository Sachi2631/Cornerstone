import React, { useState } from 'react';

import { Box, Typography, Button } from '@mui/material';
import Bart from '../components/Menut'; // ✅ Your hamburger menu


const Gallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'characters' | 'items'>('characters');

  return (
    <div style={{ textAlign: 'center', backgroundColor: '#dee2e4', minHeight: '100vh' }}>
      <style>
        {`
          #top {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            margin-top: 40px;
            gap: 100px;
          }

          #two {
            width: 1px;
            height: 35px;
            background-color: #333;
          }

          button {
            background-color: transparent;
            border: none;
            font-size: 20px;
            cursor: pointer;
          }

          .active {
            text-decoration: underline;
          }

          .row {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            margin: auto;
            width: 600px;
            padding: 30px;
          }

          .box {
            height: 30vh;
            background-color: #989291;
            border-radius: 17px;
          }

          .part {
            width: 200px;
            margin-top: 10px;
          }

          h1{
          padding: 40px;}
        `}
      </style>

      <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
        <Bart />
      </Box>

      <h1>Gallery</h1>

      <div id="top">
        <button
          id="chaBtn"
          className={activeTab === 'characters' ? 'active' : ''}
          onClick={() => setActiveTab('characters')}
        >
          Characters
        </button>

        <div id="two"></div>

        <button
          id="iteBtn"
          className={activeTab === 'items' ? 'active' : ''}
          onClick={() => setActiveTab('items')}
        >
          Items
        </button>
      </div>

      {activeTab === 'characters' && (
        <div id="char">
          <div className="row">
            <GalleryCard title="Momotaro" />
            <GalleryCard title="???" />
          </div>
          <div className="row">
            <GalleryCard title="???" />
            <GalleryCard title="???" />
          </div>
        </div>
      )}

      {activeTab === 'items' && (
        <div id="itemsContent">
          <div className="row">
            <GalleryCard title="Simple Katana" />
            <GalleryCard title="???" />
          </div>
          <div className="row">
            <GalleryCard title="???" />
            <GalleryCard title="???" />
          </div>
        </div>
      )}
    </div>
  );
};

interface GalleryCardProps {
  title: string;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ title }) => (
  <div className="part">
    <div className="box"></div>
    <h3>{title}</h3>
  </div>
);

export default Gallery;
