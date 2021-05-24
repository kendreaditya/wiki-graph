import React from 'react';
import {InteractiveForceGraph, ForceGraphNode, ForceGraphLink} from 'react-vis-force';
import Graph from './components/graph';
import {getLinks} from './components/api'
import Search from "./components/search";

// render as more responces come in
// add ability to add and remove nodes -> search list materail ui list
// add algorhtims to choose nodes -> number of nodes to render

function App() {
  const [value, setValue] = React.useState(null)
  const [renderedGraph, setRenderedGraph] = React.useState([]);
  var allNodes = new Map();

  const renderGraph = async (nodes, links) => {
    let graphNodes = await Array.from(nodes).map(([title, edge])=>{
      // check if node is already rendered ~ via allNodes, but the thing is this fucntion is a map and can't pass/continue, and if you try forEach then you get problems with skiping code
      return <ForceGraphNode node={{id: title}}/>
    })

    let graphLinks = await links.map((link)=>{
      // fix by checking .length===0
      return <ForceGraphLink link={{source: link[0], target: link[1]}}/>
    })  

    // renderedGraph.length!==0 ? setRenderedGraph([...renderedGraph, ...graphNodes, ...graphLinks]) : setRenderedGraph([<ForceGraphNode node={{ id: value.title}} fill="red" />, ...graphNodes, ...graphLinks]);  
    // renderedGraph.length!==0 ? setRenderedGraph([...renderedGraph, ...graphNodes]) : setRenderedGraph([<ForceGraphNode node={{ id: value.title}} fill="red" />, ...graphNodes]);  
    // renderedGraph.length!==0 ? renderedGraph.push(...graphNodes) : renderedGraph.push(<ForceGraphNode node={{ id: value.title}} fill="red" />, ...graphNodes);  
    renderedGraph.length!==0 ? renderedGraph.push(...graphNodes, ...graphLinks) : renderedGraph.push(<ForceGraphNode node={{ id: value.title}} fill="red" />, ...graphNodes, ...graphLinks);  
    setRenderedGraph(renderedGraph);
    console.log(renderedGraph)
  };

// await setTimeout(function(){
//   setRenderedGraph(graph)
// }, 3000);

  const getAllLinks = async (rootPage, depth) => {
    const _links = async (page) => {
      let pageLinks = await getLinks(page.pageid);
      let pageGraphNodes = new Map();
      let pageGraphLinks = [];
      
      // might return before this forEach loop is done
      pageLinks.forEach((link) => {
        pageGraphNodes.set(link.title, link);
        pageGraphLinks.push([link.title, page.title]);
      });

      return [pageGraphNodes, pageGraphLinks];
    };

    let pages = [rootPage];

    for(var i=0; i<depth; i++){
     
      pages = await pages
      pages = pages.map(async (page)=>{
        page = await page 
        console.log(await page)
        let [pageGraphNodes, pageGraphLinks] = await _links(page);
        renderGraph(pageGraphNodes, pageGraphLinks);
        return await Array.from(await pageGraphNodes.values());
      })[0]
    }
  }


  React.useEffect(() => (value ? getAllLinks(value, 2) : null), [value]);
  React.useEffect(()=> console.log(renderedGraph), [renderedGraph]);



  return (
    <div>
      <div className="search-bar">
        <Search setValue={setValue}/>
      </div>
      {renderedGraph.length!==0 ?
      <InteractiveForceGraph>
        {renderedGraph}
      </InteractiveForceGraph>
      : console.log("Graph not rendered")}
    </div>
  );
}

export default App;
