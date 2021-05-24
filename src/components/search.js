import React, { useEffect } from 'react';
import {search} from './api'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function Search({setValue}) {
    let value = null;
    const [searchTerm, setSearchTerm] = React.useState(null);
    const [articles, setArticles] = React.useState([]);

    useEffect(()=>{
        if(searchTerm){
            search(searchTerm).then(res => setArticles(res.query.search))
        }
    }, [searchTerm])

    return (
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
        style={{ width: 300 }}
        freeSolo
        renderInput={(params) => (
            <TextField autoFocus {...params} label="wikipedia article" variant="outlined" onChange={(event)=>setSearchTerm(event.target.value)}/>
        )}
        />
    );
}