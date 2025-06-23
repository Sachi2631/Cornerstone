import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import * as d3 from 'd3';
import { createRoot } from 'react-dom/client';

const Dashboard = (): React.ReactElement => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const handleResize = () => {
      const width = Math.min(window.innerWidth * 0.9, 1200);
      const height = width * 0.625; // 16:10 ratio
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
    svg.selectAll('*').remove(); // Clear previous drawings

    const g = svg.append('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    d3.json('/japan.geojson').then((data: any) => {
      if (!data?.features) {
        console.error('Invalid GeoJSON structure');
        return;
      }

      // 🧭 Match Okinawa-visible map projection
      const projection = d3.geoMercator()
        .center([67.5, 32.5]) // Includes Okinawa
        .scale((width / 1000) * 2200) // Responsive zoom level
        .translate([width / 2, height / 2]);

      const path = d3.geoPath().projection(projection);

      projection.fitExtent(
        [[60, 40], [width - 20, height - 20]],
        data
      );

      // Draw prefectures
      g.selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('d', path as any)
        .attr('fill', '#e0e0e0')
        .attr('stroke', '#333')
        .attr('stroke-width', 0.5)
        .on('mouseover', function () {
          d3.select(this).attr('fill', '#90caf9');
        })
        .on('mouseout', function () {
          d3.select(this).attr('fill', '#e0e0e0');
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

      // Add MUI pins at prefecture centroids
      data.features.forEach((d: any) => {
        const [x, y] = projection(d3.geoCentroid(d)) || [0, 0];

        const foreignObject = g.append('foreignObject')
          .attr('x', x - 10)
          .attr('y', y - 30)
          .attr('width', 20)
          .attr('height', 30)
          .style('pointer-events', 'none');

        const div = document.createElement('div');
        div.style.width = '20px';
        div.style.height = '30px';

        foreignObject.node()?.appendChild(div);

        const root = createRoot(div);
        root.render(
          <LocationOnIcon sx={{ fontSize: 20, color: 'red' }} />
        );
      });
    });

    // Initial zoom and translation
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
        const initialScale = 1.3;
        const initialTranslate = [
          (width * (1.05 - initialScale)) / 2,
          (height * (1.125 - initialScale)) / 2,
        ];
      
        svg.transition()
          .duration(1250)
          .call(
            zoom.transform as any,
            d3.zoomIdentity.translate(initialTranslate[0], initialTranslate[1]).scale(initialScale)
          );
      
        setSelectedPrefecture(null);
      });      
  }, [containerSize]);

  return (
      <Box display="flex" flexDirection="column" alignItems="center" bgcolor="white" minWidth="100vw">
        <Box
          component="main"
          flexGrow={1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          width="100vw"
          bgcolor="orange"
          // px={2}
          // py={2}
        >
          <Box display="flex" flexDirection="row"
            sx={{
              width: '100vw',
              // maxWidth: '1200px',
              aspectRatio: '16/11',
              position: 'relative',
              border: '2px solid #ccc',
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#dfe2e5', // sea color

            }}
          >
            <svg
              ref={svgRef}
              width="80%"
              height="100%"
              viewBox={`0 0 ${containerSize.width} ${containerSize.height}`}
              preserveAspectRatio="xMidYMid meet"
            />

          </Box>
          
          {/* next up box */}
            <Box
              sx={{
                padding: "10px",
                marginRight:"10px",
                position: "fixed",
                width: "20vw",
                top: "15vh",
                borderRadius: "10px",
                // borderStyle: "solid",
                // borderWidth: "3px",
                // borderColor: "lightgray",
                bgcolor: "#d3d3d3",
                paddingLeft: "20px",
                boxShadow: 3,
              }}
              >
                <Typography variant="h6" style={{fontWeight:"600"}}>Up Next:</Typography>
                <Box
                  sx={{
                    textAlign:"center",
                  }}
                >
                  <Typography>1. Lesson 1</Typography>
                </Box>
                
            </Box>

            {/* prefecture name */}
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
{/*         
      
      <Box
          sx={{
            width: "24vw",
            bgcolor:"cerulean",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            bgColor:"red",
            alignItems: "center",
          }}
          > */}

          
          {/* <Box
          sx={{
            padding: "10px",
            position: "fixed",
            width: "20vw",
            top: "60vh",
            borderRadius: "10px",
            // borderStyle: "solid",
            // borderWidth: "3px",
            // borderColor: "lightgray",
            bgcolor: "white",
            paddingLeft: "20px",
            boxShadow: 3,
          }}
          >
            <Typography variant="h6" style={{fontWeight:"600"}} >To-Review List!</Typography>
            <Typography>1. Lesson 1</Typography>
            <Typography>2. Lesson 2</Typography>
            <Typography>3. Lesson 3</Typography>
          </Box> */}
      </Box>
    // </Box>
  );
};

export default Dashboard;