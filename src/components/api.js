var url = "https://en.wikipedia.org/w/api.php"; 

export const search = (term) => {
    let params = {
        action: "query",
        list: "search",
        srsearch: term,
        format: "json"
    };
    
    let search_url = url + "?origin=*";
    Object.keys(params).forEach(function(key){search_url += "&" + key + "=" + params[key];});

    return fetch(search_url)
        .then((response) => response.json())
        .catch((error) => error);
    
}

export async function getLinks(id) {
    let links = [];

    // let params = {
    //     action: "query",
    //     prop: "links",
    //     pageids: id,
    //     pllimit: 500,
    //     format: "json",
    // };

    let params = {
        action: "query",
        pageids: id,
        generator: "links",
        format: "json",
        gpllimit: "10"
    };

    let links_url = url + "?origin=*";
    Object.keys(params).forEach(function(key){links_url += "&" + key + "=" + params[key];});

    // Continue function
    async function get(plcontinue=null) {
        if(plcontinue)
            links_url = links_url + `&plcontinue=${plcontinue}`
            await fetch(links_url)
            .then(res => res.json())
            .then(response => {
                Object.keys(response.query.pages).forEach((pageid)=>{
                    links.push({
                        pageid: pageid,
                        title: response.query.pages[pageid].title
                    })
                })
                // response.query.pages[id].links.forEach((article) => {links.push(article.title)})

                // Checks if more links exists via continue.plcontinue
                if(response.continue){
                    // get(response.continue.plcontinue)
                }
            })
            .catch((error) => console.log(error));
    }

    await get()
    return links
}
