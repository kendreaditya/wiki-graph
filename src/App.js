import React from 'react';
import {InteractiveForceGraph, ForceGraphNode, ForceGraphLink} from 'react-vis-force';
import Node from './components/graph';
import {getLinks} from './components/api'
import Search from "./components/search";

function App() {
  const [value, setValue] = React.useState(null)
  const [renderedGraph, setRenderedGraph] = React.useState(null);

  function getGraph(articles) {
    var root = new Node(value, [])
    articles.map((article)=>{
      getLinks(article.pageid).then(links => {
          root.edges.push(new Node(article, links.map((link)=>{
            return new Node(link, [])
          })))
        }
      )
    })
    return root;
  }

  React.useEffect(()=> {
    if(value){
      getLinks(value.pageid).then(res => {
        let root = getGraph(res)
        console.log(root)
        console.log(root.edges.length)

        let graph = []
        graph.push(<ForceGraphNode node={{ id: root.info.title}} fill="red" />)
        root.edges.forEach((edgeOne) => {
          graph.push(<ForceGraphNode node={{id: edgeOne.info.title}}/>)
          graph.push(<ForceGraphLink link={{source: root.info.title, target: edgeOne.info.title}}/>)
          edgeOne.edges.forEach((edgeTwo)=>{
            graph.push(<ForceGraphNode node={{id: edgeTwo.info.title}}/>)
            graph.push(<ForceGraphLink link={{source: edgeOne.info.title, target: edgeTwo.info.title}}/>)
          })
        })
        setRenderedGraph(graph)
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
