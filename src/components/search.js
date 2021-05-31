import React, { useEffect } from 'react';
import {search} from './api'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './search.css'

export default function Search({setGraphData}) {
    var value = null;
    var depth = null;
    const [searchTerm, setSearchTerm] = React.useState(null);
    const [articles, setArticles] = React.useState([]);

    useEffect(()=>{
        if(searchTerm){
            search(searchTerm).then(res => setArticles(res.query.search))
        }
    }, [searchTerm])

    return (
        <ul id="tool-bar">
            <li id="search-bar">
                <Autocomplete
                    value={value}
                    onChange={(event, newValue) => {
                        if (typeof newValue === 'string') {
                            value = newValue;
                        } else {
                            value = newValue;
                        }
                    }}
                    options={articles}
                    getOptionLabel={(option) => {
                        if (typeof option === 'string') {
                        return option;
                        }
                        return option.title;
                    }}
                    style={{ width: 300, float: 'right' }}
                    freeSolo
                    renderInput={(params) => (
                        <TextField autoFocus {...params} label="wikipedia article" variant="outlined" onChange={(event)=>setSearchTerm(event.target.value)}/>
                    )}
                />
            </li>
            <li id="depth-feild">
                <TextField id="depth-text-field" label="depth" variant="outlined" onChange={(event)=>depth = event.target.value} style={{maxWidth: 74}}/>
            </li>
            <li>
                <Button id="render-button" variant="outlined" onClick={()=>setGraphData(value, depth)}>
                    Render
                </Button>
            </li>
        </ul>
    );
}