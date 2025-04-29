
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import '../styles/GraphVisualization.css';

const GraphVisualization = ({ nodes, edges, currentNodeIndex }) => {
  const svgRef = useRef(null);
  

  useEffect(() => {
    if (!nodes || nodes.length === 0 || !svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    

    svg.selectAll("*").remove();
    

    const simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(d => d.hash).distance(50))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1));
    

    const graphNodes = nodes.map(node => ({
      ...node,
      x: width / 2 + (Math.random() - 0.5) * 100,
      y: height / 2 + (Math.random() - 0.5) * 100
    }));
    
    const graphLinks = edges.map(edge => ({
      source: edge.source,
      target: edge.target
    }));
    

    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graphLinks)
      .enter()
      .append("line")
      .attr("stroke", "rgba(0, 0, 0, 0.2)")
      .attr("stroke-width", 1);
    

    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(graphNodes)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("fill", (d, i) => {

        if (i === currentNodeIndex) {
          return "var(--secondary-color)";
        }

        return "var(--node-color)";
      })
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
    

    node.append("title")
      .text(d => `Depth: ${d.depth}`);
    

    simulation.nodes(graphNodes).on("tick", ticked);
    simulation.force("link").links(graphLinks);
    
    function ticked() {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
        
      node
        .attr("cx", d => d.x = Math.max(5, Math.min(width - 5, d.x)))
        .attr("cy", d => d.y = Math.max(5, Math.min(height - 5, d.y)));
    }
    
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    

    if (currentNodeIndex !== null) {
      let currentNode = nodes[currentNodeIndex];
      

      while (currentNode && currentNode.parent) {

        const pathEdge = edges.find(edge => 
          edge.source === currentNode.parent.hash && edge.target === currentNode.hash
        );
        
        if (pathEdge) {

          svg.selectAll("line")
            .filter(d => d.source.hash === pathEdge.source && d.target.hash === pathEdge.target)
            .attr("stroke", "var(--secondary-color)")
            .attr("stroke-width", 2);
        }
        
        currentNode = currentNode.parent;
      }
    }
    
    return () => {
      simulation.stop();
    };
  }, [nodes, edges, currentNodeIndex]);
  
  useEffect(() => {
    const handleResize = () => {
      if (nodes && nodes.length > 0) {
        // Rerender the graph on window resize
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        
        setTimeout(() => {
          const tempSvg = svgRef.current;
          if (tempSvg) {
            const width = tempSvg.clientWidth;
            const height = tempSvg.clientHeight;

          }
        }, 0);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [nodes, edges]);

  return (
    <div className="graph-visualization">
      {nodes.length === 0 ? (
        <div className="empty-graph">
          <p>Start solving to see the search visualization</p>
        </div>
      ) : (
        <svg ref={svgRef} className="graph-svg"></svg>
      )}
    </div>
  );
};

export default GraphVisualization;
