import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Button
} from '@mui/material';
import * as d3 from 'd3';
import Footer from '../components/Footer';
import Header from '../components/Header';

const Learn = (): React.ReactElement => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);

  useEffect(() => {
    const width = 600;
    const height = 600;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    // ✅ Correct file path
    d3.json('/japan.geojson').then((data: any) => {
      if (!data || !data.features) {
        console.error('Invalid GeoJSON structure');
        return;
      }

      const projection = d3.geoMercator().fitSize([width, height], data);
      const path = d3.geoPath().projection(projection);

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
            .duration(750)
            .call(
              zoom.transform as any,
              d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
            );

          // ✅ Correct property access
          const name = d.properties?.nam_ja || d.properties?.nam || 'Unknown Prefecture';
          setSelectedPrefecture(name);
          alert(`You clicked on ${name}`);
        });
    });

    // ✅ Reset map when clicking outside
    svg.on('click', () => {
      svg.transition()
        .duration(750)
        .call(zoom.transform as any, d3.zoomIdentity);
      setSelectedPrefecture(null);
    });
  }, []);

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />

      <Box
        component="main"
        flexGrow={1}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        px={3}
        textAlign="center"
      >
        <Typography variant="h3" mb={3}>
          Explore Japan!
        </Typography>
        <Typography variant="h6" mb={4}>
          Click on a prefecture to learn more. Click outside to reset.
        </Typography>

        <Container maxWidth="md">
          <svg
            ref={svgRef}
            width="100%"
            height="600"
            viewBox="0 0 600 600"
            style={{ border: '1px solid #ccc', borderRadius: '8px' }}
          />
        </Container>

        <Button variant="contained" color="primary" href="/dashboard" sx={{ mt: 4 }}>
          Go to Dashboard
        </Button>
      </Box>

      <Footer />
    </Box>
  );
};

export default Learn;
