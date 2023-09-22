
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import {useState} from 'react'
import "./Search.css"
import { useNavigate } from 'react-router-dom'


function Search() {

    // const items = useStore(state => state.items)
    // const addItems = useStore(state => state.addItems)
    // const clearItems = useStore(state => state.clearItems)
    const  navigate = useNavigate()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(false)

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
    console.log(item)
    navigate(`/article/${item.id}`)
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

        
        <div className ='search-container' style={{ backgroundColor: "#db8872", width: 500, height: 300, marginTop: 0, borderRadius: 10 }}>
            
            <h1 style={{color:'white', marginBottom: 20, marginTop: 60,}}>Search</h1>
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
