
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import '../styles/GraphVisualization.css';

const GraphVisualization = ({ nodes, edges, currentNodeIndex }) => {
  const svgRef = useRef(null);
  
  // Set up and render the graph visualization
  useEffect(() => {
    if (!nodes || nodes.length === 0 || !svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    // Clear previous visualization
    svg.selectAll("*").remove();
    
    // Create a force directed graph
    const simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(d => d.hash).distance(50))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1));
    
    // Process the nodes and edges
    const graphNodes = nodes.map(node => ({
      ...node,
      x: width / 2 + (Math.random() - 0.5) * 100,
      y: height / 2 + (Math.random() - 0.5) * 100
    }));
    
    const graphLinks = edges.map(edge => ({
      source: edge.source,
      target: edge.target
    }));
    
    // Create the links
    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graphLinks)
      .enter()
      .append("line")
      .attr("stroke", "rgba(0, 0, 0, 0.2)")
      .attr("stroke-width", 1);
    
    // Create the nodes
    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(graphNodes)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("fill", (d, i) => {
        // For the current path node
        if (i === currentNodeIndex) {
          return "var(--secondary-color)";
        }
        // For explored nodes
        return "var(--node-color)";
      })
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
    
    // Add tooltip on hover
    node.append("title")
      .text(d => `Depth: ${d.depth}`);
    
    // Update node positions in each tick of the simulation
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
    
    // Highlight the current path
    if (currentNodeIndex !== null) {
      let currentNode = nodes[currentNodeIndex];
      
      // Trace back through parents to highlight the path
      while (currentNode && currentNode.parent) {
        // Find the edge between this node and its parent
        const pathEdge = edges.find(edge => 
          edge.source === currentNode.parent.hash && edge.target === currentNode.hash
        );
        
        if (pathEdge) {
          // Find and highlight the link
          svg.selectAll("line")
            .filter(d => d.source.hash === pathEdge.source && d.target.hash === pathEdge.target)
            .attr("stroke", "var(--secondary-color)")
            .attr("stroke-width", 2);
        }
        
        // Move to the parent
        currentNode = currentNode.parent;
      }
    }
    
    // Clean up on unmount
    return () => {
      simulation.stop();
    };
  }, [nodes, edges, currentNodeIndex]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (nodes && nodes.length > 0) {
        // Rerender the graph on window resize
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        
        // Force a rerender by updating the state
        // This is a simplified approach - in a real app you might want to debounce this
        setTimeout(() => {
          const tempSvg = svgRef.current;
          if (tempSvg) {
            const width = tempSvg.clientWidth;
            const height = tempSvg.clientHeight;
            // Do the rerender
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
