
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import {useState} from 'react'
import "./Search.css"



function Search() {

    // const items = useStore(state => state.items)
    // const addItems = useStore(state => state.addItems)
    // const clearItems = useStore(state => state.clearItems)
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(false)

    // const items = [
    //     {
    //       id: 0,
    //       name: "Cobol",
    //     },
    //     {
    //       id: 1,
    //       name: "JavaScript",
    //     },
    //     {
    //       id: 2,
    //       name: "Basic",
    //     },
    //     {
    //       id: 3,
    //       name: "PHP",
    //     },
    //     {
    //       id: 4,
    //       name: "Java",
    //     },
    //   ];

    const handleOnSearch = (string, results) => {
        // console.log(string, results);
        // console.log(string)
        const url = `api/search?title=${string}`
        // console.log('sending request to', url)
        setLoading(true)
        fetch(url)
                .then(res => {
                    console.log(res)
                    if (!res.ok) {
                        console.eror("Search failed", res)
                        throw new Error('Search failed')
                    }
                return res.json()
                })
                .then(data => {
                    console.log(data, 'this is my data logging')
                    setItems(data)
                    // console.log(items)
                
                
                })
                .catch(error => console.error('Network error', error))
                .finally(() => { 
                    setLoading(false)
                })
            
        
    };
    // useEffect(() => {
    //     console.log(items, 'this my useefffect')
    // }, [items])

    const handleOnHover = (result) => {
    // console.log(result);
    };

    const handleOnSelect = (item) => {
    console.log(item, 'you done did select');
    };

    const handleOnFocus = () => {
    // console.log("Focused");
    };

    const handleOnClear = () => {
        
    };

    const formatResult = (item) => {
        return (
            <>
            <div className="result-wrapper">
                <span className="result-title">{item.name}</span>
            </div>
            <div className="result-wrapper">
                 <a href={item.url} target="_blank" rel="noreferrer" className="result-url">{item.url}</a>
            </div>
            </>
        );
    };

    return (
    <div className="App">
        <header className="App-header">

        
        <div style={{ width: 300, margin: 20 }}>
            
            <div style={{ marginBottom: 20 }}>Search</div>
            <ReactSearchAutocomplete
            items={items}
            onSearch={handleOnSearch}
            onHover={handleOnHover}
            onSelect={handleOnSelect}
            onFocus={handleOnFocus}
            onClear={handleOnClear}
            styling={{ zIndex: 1 }}
            formatResult={formatResult}
            autoFocus
            />
            
        </div>

        </header>
    </div>
    );
    }

    export default Search;
