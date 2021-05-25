import React, { useEffect } from 'react';
import {search} from './api'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './search.css'

export default function Search({setValue, setDepth}) {
    let value = null;
    const [searchTerm, setSearchTerm] = React.useState(null);
    const [articles, setArticles] = React.useState([]);

    useEffect(()=>{
        if(searchTerm){
            search(searchTerm).then(res => setArticles(res.query.search))
        }
    }, [searchTerm])

    return (
        <div id="tool-bar">
            <div id="search-bar">
                <Autocomplete
                    value={value}
                    onChange={(event, newValue) => {
                        if (typeof newValue === 'string') {
                        setValue({
                            title: newValue,
                        });
                        } else {
                        setValue(newValue);
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
            </div>
            <div id="depth-feild">
                <TextField label="depth" variant="outlined" onChange={(event)=>setDepth(event.target.value)} style={{maxWidth: 74}}/>
            </div>
        </div>
    );
}