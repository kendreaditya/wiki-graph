import React from 'react';
import {InteractiveForceGraph, ForceGraphNode, ForceGraphLink, set} from 'react-vis-force';
import Graph from './components/graph';
import {getLinks} from './components/api'
import Search from "./components/search";

// render as more responces come in
// add ability to add and remove nodes -> search list materail ui list
// add algorhtims to choose nodes -> number of nodes to render

function App() {
  const [value, setValue] = React.useState(null)
  const [renderedGraph, setRenderedGraph] = React.useState(null);
  const [nodes, setNodes] = React.useState(new Map()); 
  const [links, setLinks] = React.useState([]); 

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
      var depthPages = [];

      await pages.forEach(async (page)=>{
        let [pageGraphNodes, pageGraphLinks] = await _links(page);
        depthPages = await [...depthPages, ...pageGraphNodes.values()];
        // Automatically diregards 2nd instance of hash map
        console.log(pageGraphNodes)
        setNodes(await new Map([...nodes, ...pageGraphNodes]));
        setLinks(await [links, ...pageGraphLinks]);
        console.log(nodes)
        console.log(links)
      })

      console.log(await depthPages)
      pages = await depthPages;
    }
  }

  const updateGraph = async () => {
    // Divide links and nodes + don't rerender everything everything (figure out whats newly added)
    let graph = []
  
    graph.push(<ForceGraphNode node={{ id: value.title}} fill="red" />)

    nodes.forEach(async (edge) => {
      graph.push(<ForceGraphNode node={{id: edge.title}}/>)
    })
  
    links.forEach((link) => {
      // fix by checking .length===0
      if(link[0])
        graph.push(<ForceGraphLink link={{source: link[0], target: link[1]}}/>)
    })

    await setTimeout(function(){
      setRenderedGraph(graph)
    }, 3000);
  }  


  React.useEffect(() => (value ? getAllLinks(value, 2) : null), [value])

  React.useEffect(()=> ( value ? updateGraph() : null), [links, nodes])


  return (
    <div>
      <div className="search-bar">
        <Search setValue={setValue}/>
      </div>
      {renderedGraph ?
      <InteractiveForceGraph>
        {renderedGraph}
      </InteractiveForceGraph>
      : console.log("Graph not rendered")}
    </div>
  );
}

export default App;
