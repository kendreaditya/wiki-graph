import React from 'react';
import {InteractiveForceGraph, ForceGraphNode, ForceGraphLink} from 'react-vis-force';
import Graph from './components/graph';
import {getLinks} from './components/api'
import Search from "./components/search";
import { render } from '@testing-library/react';

// render as more responces come in
// add ability to add and remove nodes -> search list materail ui list
// add algorhtims to choose nodes -> number of nodes to render

function App() {
  const [value, setValue] = React.useState(null)
  const [renderedGraph, setRenderedGraph] = React.useState(null);

  const renderGraphNodes = (nodes) => {
    let graphNodes = Array.from(nodes).map(([title, edge])=>{
      return <ForceGraphNode node={{id: title}}/>
    })
    console.log(graphNodes);
    renderedGraph ? setRenderedGraph([...renderedGraph, ...graphNodes]) : setRenderedGraph([...graphNodes]);  
  };

  const renderGraphLinks = (links) => {
    let graphLinks = links.map((link)=>{
      // fix by checking .length===0
      console.log(link[0], link[1])
      return <ForceGraphLink link={{source: link[0], target: link[1]}}/>
    })
    renderedGraph ? setRenderedGraph([...renderedGraph, ...graphLinks]) : setRenderedGraph([...graphLinks]);  
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
    setRenderedGraph([<ForceGraphNode node={{ id: value.title}} fill="red" />]);

    for(var i=0; i<depth; i++){
      var depthPages = [];
      
      await pages.forEach(async (page)=>{
        let [pageGraphNodes, pageGraphLinks] = await _links(page);

        renderGraphNodes(pageGraphNodes);
        renderGraphLinks(pageGraphLinks);

        depthPages = await [...depthPages, ...pageGraphNodes.values()];
        // Automatically diregards 2nd instance of hash map
      })

      pages = await depthPages;
    }
  }


  React.useEffect(() => (value ? getAllLinks(value, 1) : null), [value]);
  React.useEffect(()=> console.log(renderedGraph), [renderedGraph]);



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
