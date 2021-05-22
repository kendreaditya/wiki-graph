import React from 'react';
import {InteractiveForceGraph, ForceGraphNode, ForceGraphLink} from 'react-vis-force';
import Node from './components/graph';
import {getLinks} from './components/api'
import Search from "./components/search";

function App() {
  const [value, setValue] = React.useState(null)
  const [renderedGraph, setRenderedGraph] = React.useState(null);

  function getGraph(articles) {
    return new Node(value, articles.map(async (article)=>{
      let links = await getLinks(article.pageid);
      return (new Node(article, links.map((link)=>{
        return new Node(link, [])
      })))
    }))
  }

  React.useEffect(()=> {
    if(value){
      getLinks(value.pageid).then(async (res) => {
        let root = await getGraph(res)
        console.log(root.edges)

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
        console.log(graph)
        await setTimeout(() => { console.log("World!");
        setRenderedGraph(graph)
        
      }, 2000);
        console.log(graph)
      }) 
    }
  }, [value]);

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
