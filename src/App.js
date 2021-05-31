import React from 'react';
import {InteractiveForceGraph, ForceGraphNode, ForceGraphLink} from 'react-vis-force';
import Graph from './components/graph';
import {getLinks} from './components/api'
import Search from "./components/search";
import Preview from './components/preview';
import './App.css';

// fix depth lag
// add size based on connections 
// add color based on root node
// add updated poping animation based on rendering graph
// add ability to add and remove nodes -> search list materail ui list
// add ability to click on on node an take to wiki page
// add ability to preview wikipage when hovering
// add ability to change different topic
// render as more responces come in -> dont' think thats possible
// add ML agorhtims for sorting via sentamet/attention/relativeness

function App() {
  const [value, setValue] = React.useState(null)
  const [depth, setDepth] = React.useState(2)
  const [renderedGraph, setRenderedGraph] = React.useState([]);
  const [selectedNode, setSelectedNode] = React.useState(null);
  var allNodes = new Map();
  
  const renderGraph = async (nodes, links) => {
    let graphNodes = await nodes.reduce((result, edge) => {
      if(!allNodes.has(edge.title)){
        allNodes.set(edge.title, edge)
        result.push(<ForceGraphNode node={{id: edge.title, pageid: edge.pageid}} />)
      } 
      return result
    }, []);
    
    let graphLinks = await links.map((link)=>{
      return <ForceGraphLink link={{source: link[0], target: link[1]}}/>
    })  
    
    setRenderedGraph(renderedGraph => {
      // the line below eliminates the need to rerender by pressing enter twice, but causes a distored graph
      // renderedGraph.length!==0 ? setRenderedGraph([...renderedGraph, ...graphNodes, ...graphLinks]) : setRenderedGraph([<ForceGraphNode node={{ id: value.title}} fill="red" />, ...graphNodes, ...graphLinks]);
      renderedGraph.length!==0 ? renderedGraph.push(...graphNodes, ...graphLinks) : renderedGraph.push(<ForceGraphNode node={{ id: value.title}} fill="red" />, ...graphNodes, ...graphLinks);  
      return renderedGraph;
    });
  };

  const setGraphData = (value, depth) => {
    setValue(value)
    setDepth(depth)
  }

  const getAllLinks = async (rootPage, depth) => {
    const _links = async (page) => {
      let pageLinks = await getLinks(page.pageid);
      let pageGraphNodes = [];
      let pageGraphLinks = [];
      
      pageLinks.forEach((link) => {
        pageGraphNodes.push(link);
        pageGraphLinks.push([link.title, page.title]);
      });

      return [pageGraphNodes, pageGraphLinks];
    };

    let pages = [rootPage];

    for(var i=0; i<depth; i++){
     
      pages = await pages.reduce(async (pageNodes, page) => {
        page = await page;
        let [pageGraphNodes, pageGraphLinks] = await _links(page);
        renderGraph(pageGraphNodes, pageGraphLinks);

        pageNodes = await pageNodes
        pageNodes.push(pageGraphNodes)
        return pageNodes.flat()
      }, [])
    }
  }

  React.useEffect(() => (value ? getAllLinks(value, depth) : null), [value]);

  return (
    <div>
      <div className="search-bar">
        <Search setGraphData={setGraphData}/>
      </div>
      <div id="graph-information" style={{textAlign: "center"}}>
        {selectedNode ? <Preview node={selectedNode} /> : null}
        {renderedGraph.length!==0 ?
        <InteractiveForceGraph
        onSelectNode={(event, node) => setSelectedNode(node)}
        simulationOptions={{ animate: true }}
        
        >
          {renderedGraph}
        </InteractiveForceGraph>
        : console.log("Graph not rendered")}
      </div>
    </div>
  );
}

export default App;
