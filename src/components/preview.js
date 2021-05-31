import React from 'react';
import './preview.css';
import {pageURL} from './api.js';

const Preview = ({node}) => {
    let articleName = node.id.replace(" ", "_");

    return (
        <div id="preview">
            <iframe id="preview-panel" src={`${pageURL}/${articleName}`} title="Preview Page"></iframe>
        </div>
    )
};

export default Preview;