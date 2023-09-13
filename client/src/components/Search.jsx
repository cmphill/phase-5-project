

import React from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";


function Search() {

  const items = [{id: 0, name: "teset"},]


  const handleOnSearch = (string, results) => {
    console.log(string, results);
    fetch('/articles')
  };

  const handleOnHover = (result) => {
    console.log(result);
  };

  const handleOnSelect = (item) => {
    console.log(item);
  };

  const handleOnFocus = () => {
    console.log("Focused");
  };

  const handleOnClear = () => {
    console.log("Cleared");
  };

  const formatResult = (item) => {
    console.log(item);
    return (
      <div className="result-wrapper">
        <span className="result-span">name: {item.name}</span>
      </div>
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
