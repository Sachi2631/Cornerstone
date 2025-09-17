import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Button } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import * as d3 from 'd3';
import { createRoot } from 'react-dom/client';
import Bart from '../components/Menut';
import { Link } from 'react-router-dom';


const Dashboard = (): React.ReactElement => {
const svgRef = useRef<SVGSVGElement | null>(null);
const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);
const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
const [popup, setPopup] = useState<{ x: number; y: number; name: string } | null>(null);


useEffect(() => {
const handleResize = () => {
const width = Math.min(window.innerWidth * 0.9, 1200);
const height = width * 0.625;
setContainerSize({ width, height });
};


window.addEventListener('resize', handleResize);
handleResize();
return () => window.removeEventListener('resize', handleResize);

}, []);


useEffect(() => {
if (!svgRef.current) return;


const { width, height } = containerSize;
const svg = d3.select(svgRef.current);
svg.selectAll('*').remove();

const g = svg.append('g');

const zoom = d3.zoom<SVGSVGElement, unknown>()
  .scaleExtent([1, 8])
  .on('zoom', (event) => {
    g.attr('transform', event.transform);
  });

svg.call(zoom as any);

d3.json('/japan.geojson').then((data: any) => {
  if (!data?.features) return;

  const projection = d3.geoMercator()
    .center([67.5, 32.5])
    .scale((width / 1000) * 2200)
    .translate([width / 2, height / 2]);

  const path = d3.geoPath().projection(projection);

  projection.fitExtent([[60, 40], [width - 20, height - 20]], data);

  g.selectAll('path')
    .data(data.features)
    .enter()
    .append('path')
    .attr('d', path as any)
    .attr('fill', '#b4441d')
    .attr('stroke', '#333')
    .attr('stroke-width', 0.5)
    .on('mouseover', function () {
      d3.select(this).attr('fill', '#90caf9');
    })
    .on('mouseout', function () {
      d3.select(this).attr('fill', '#b4441d');
    })
    .on('click', function (event: MouseEvent, d: any) {
      event.stopPropagation();
      const [[x0, y0], [x1, y1]] = path.bounds(d);
      const dx = x1 - x0;
      const dy = y1 - y0;
      const x = (x0 + x1) / 2;
      const y = (y0 + y1) / 2;
      const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height)));
      const translate = [width / 2 - scale * x, height / 2 - scale * y];

      svg.transition()
        .duration(1250)
        .call(
          zoom.transform as any,
          d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
        );

      const name = d.properties?.nam_ja || d.properties?.nam || 'Unknown Prefecture';
      setSelectedPrefecture(name);
    });

  data.features.forEach((d: any) => {
    const [x, y] = projection(d3.geoCentroid(d)) || [0, 0];

    const foreignObject = g.append('foreignObject')
      .attr('x', x - 10)
      .attr('y', y - 18)
      .attr('width', 30)
      .attr('height', 30)
      .style('pointer-events', 'auto')
      .style('cursor', 'pointer')
      .on('click', (event) => {
        event.stopPropagation();
        const name = d.properties?.nam_ja || d.properties?.nam || 'Unknown Prefecture';
        setPopup({ x, y, name });
      });

    const div = document.createElement('div');
    div.style.width = '20px';
    div.style.height = '30px';

    foreignObject.node()?.appendChild(div);

    const root = createRoot(div);
    root.render(
      <LocationOnIcon sx={{ fontSize: 20, color: 'black' }} />
    );
  });
});

const initialScale = 1.3;
const initialTranslate = [
  (width * (1.05 - initialScale)) / 2,
  (height * (1.125 - initialScale)) / 2,
];

svg.transition()
  .duration(0)
  .call(
    zoom.transform as any,
    d3.zoomIdentity.translate(initialTranslate[0], initialTranslate[1]).scale(initialScale)
  );

svg.on('click', () => {
  svg.transition()
    .duration(1250)
    .call(
      zoom.transform as any,
      d3.zoomIdentity.translate(initialTranslate[0], initialTranslate[1]).scale(initialScale)
    );
  setSelectedPrefecture(null);
  setPopup(null);
});

}, [containerSize]);


return (
<Box position="relative" width="100vw" minHeight="100vh" bgcolor="white">
{/* ✅ HAMBURGER MENU FIXED IN SAFE POSITION */}
<Box
sx={{
position: 'absolute',
top: 20,
left: 20,
zIndex: 10,
}}
>
<Bart />
</Box>


  <Box
    component="main"
    flexGrow={1}
    display="flex"
    flexDirection="column"
    justifyContent="center"
    width="100vw"
  >
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="flex-end"
      sx={{
        width: '100vw',
        aspectRatio: '16/11',
        position: 'relative',
        border: '2px solid #ccc',
        borderRadius: '8px',
        overflow: 'hidden',
        background: '#dee2e4'
      }}
    >
      {/* ✅ MAP SVG */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`200 0 ${containerSize.width} ${containerSize.height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block' }}
      />

    {popup && (
      <Box
        sx={{
          position: 'absolute',
          top: popup.y - 50,
          left: popup.x,
          transform: 'translate(-50%, -100%)',
          bgcolor: '#d9d9d9',
          borderRadius: '40px',
          padding: '12px',
          boxShadow: 3,
          zIndex: 20,
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width:'270px',
          paddingTop: '20px',
          paddingBottom: '20px',
          textAlign: 'center',
        }}
      >
      
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textAlign: 'center' }}> Unit 1: Lesson 1</Typography>
        <Typography variant="body1" sx={{ textAlign: 'center' }}>あ、い、う</Typography>
        <Typography variant="body1" sx={{ textAlign: 'center' }}>Items Collected</Typography>
        {/* <button className="lesson" onClick={() => alert(`Lesson A for ${popup.name}`)}> Lesson A </button> */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
          <Button 
            sx={{ 
              color: 'black', 
              backgroundColor:'black',
              height: '50px', 
              width:'50px',
              borderRadius: '50%',
              borderStyle: 'solid',
              marginRight: '5px',
              marginLeft: '5px',
            }} 
            onClick={() => alert(`Lesson A for ${popup.name}`)}
          >
            Lesson A
          </Button>
          <button onClick={() => alert(`Lesson B for ${popup.name}`)}> </button>
          <button onClick={() => alert(`Lesson C for ${popup.name}`)}> </button>
        </Box>
        <Link
          to={`/Lesson`}
        >
        <Button
        sx={{ 
          height: '40px',
          width: '140px',
          borderRadius: '30px',
          backgroundColor: '#92a6ba',
          border: 'none',
          fontWeight: 900,
          mt: '50px',
          textTransform: 'none',
          margin: '0 auto',
          color: '#000',
          '&:hover': {
            backgroundColor: '#7a92a8', 
          }} }
          
        >Learn!</Button>
        </Link>
      </Box>

    )}


      {/* ✅ INFO PANELS */}
      <Box
        sx={{
          padding: "20px",
          width: "20vw",
          borderRadius: "10px",
          marginRight: "5vw",
          bgcolor: "#d3d3d3",
          paddingLeft: "20px",
          boxShadow: 3,
          zIndex: 1,
          marginTop: "5vh",
          position: "absolute",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Up next:</Typography>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>Unit 1 Lesson 1</Typography>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Goal: Learn the first three letters of the Japanese alphabet
          </Typography>
          <div>
            <img src="https://www.svgrepo.com/show/528478/play-circle.svg" alt="Open" style={{ width: '60px', height: '60px' }} />
          </div>
          <Typography variant="body1" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>Grammar Lesson 1</Typography>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Goal: Learn how to use これ、それ、は
          </Typography>
          <div>
            <img src="https://www.svgrepo.com/show/528478/play-circle.svg" alt="Open" style={{ width: '60px', height: '60px' }} />
          </div>
        </Box>
      </Box>

      <Box
        sx={{
          padding: "20px",
          width: "20vw",
          borderRadius: "10px",
          marginRight: "5vw",
          bgcolor: "#d3d3d3",
          paddingLeft: "20px",
          boxShadow: 3,
          zIndex: 1,
          position: "absolute",
          marginTop: "60vh"
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Stories:</Typography>
        <Button sx={{
          width: '19vw',
          height: '80px',
          borderRadius: '10px',
          backgroundColor: '#92a6ba',
          border: 'none',
          fontWeight: 900,
          mt: '50px',
          textTransform: 'none',
          margin: '0 auto',
          color: '#000',
          '&:hover': {
            backgroundColor: '#7a92a8', 
          }} }>
          Momotaro </Button>
    </Box>

    {/* Prefecture name display */}
    <Box
      mt={4}
      minHeight="50px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        opacity: selectedPrefecture ? 1 : 0,
        transform: selectedPrefecture ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.5s ease',
        color: 'orange',
        fontWeight: 'bold',
        fontSize: '1.5rem',
      }}
    >
      {selectedPrefecture && (
        <Typography variant="h5">
          {selectedPrefecture}
        </Typography>
      )}
    </Box>
  </Box>
  </Box>
</Box>

);
};


export default Dashboard;