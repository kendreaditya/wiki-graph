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

      return (pageGraphNodes, pageGraphLinks);
    };

    let pages = [rootPage];

    for(var i=0; i<depth; i++){
      var depthPages = [];

      pages.forEach((page)=>{
        let [pageGraphNodes, pageGraphLinks] = _links(page);
        depthPage = [...depthPages, ...pageGraphNodes.values()];
        setNodes(new Map([...nodes, ...pageGraphNodes]));
        setLinks([links, ...pageGraphLinks]);
      })
      pages = depthPages;
    }
  }


  React.useEffect(() => {value ? {
    getAllLinks(value, depth=1)
  } : null}, [value])

  React.useEffect(()=> {
    let graph = []
    graph.push(<ForceGraphNode node={{ id: root.info.title}} fill="red" />)
    root.edges.forEach(async (edgeOne) => {
      edgeOne = await edgeOne;
      graph.push(<ForceGraphNode node={{id: edgeOne.info.title}}/>)
      // ph.push(<ForceGraphLink link={{source: root.info.title, target: edgeOne.info.title}}/>)
      edgeOne.edges.forEach((edgeTwo)=>{
        graph.push(<ForceGraphNode node={{id: edgeTwo.info.title}}/>)
        graph.push(<ForceGraphLink link={{source: edgeOne.info.title, target: edgeTwo.info.title}}/>)
      })
    })
  }, [links, nodes])


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
