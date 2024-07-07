import React, { useState } from 'react';
import './App.css';
import useUrlStore from './store';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import Row from './components/Row';

const App = () => {

  const [urlToShorten, setUrlToShorten] = useState("");
  const [inputForExpand, setInputForExpand] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const addUrl = useUrlStore(state => state.addUrl);

  const handleShorten = async () => {
    if (urlToShorten !== '') {
      try {
        const response = await fetch('http://localhost:3001/url/shorten', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlToShorten }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        const newEntry = {
          id: Date.now(),
          originalUrl: urlToShorten,
          shortenedUrl: data.shortenedUrl,
          dateCreated: new Date().toISOString(),
          ip: data.ip
        };
        addUrl(newEntry);
        setUrlToShorten('');
      } catch (error: any) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error(String(error));
        }
      }
    } else {
      toast.error("Please enter a URL to shorten");
    }
  };
  


  const handleExpand = async () => {
    try {
      const response = await fetch('http://localhost:3001/url/expand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputForExpand })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setOriginalUrl(data.originalUrl);
    } catch (error: any) {
      toast.error(error.message)
      console.error("Failed to expand URL:", error);
    }
  };
  

  return (
    <div className="container">
      <ToastContainer />

      <div className='row'>
        <div className='col-lg-3'>
          <h1>URL Shortener</h1>
          <input
            className='form-control'
            type="text"
            value={urlToShorten}
            onChange={e => setUrlToShorten(e.target.value)}
            placeholder="Enter URL to shorten" />
          <button className='btn btn-info btn-lg' onClick={handleShorten}>Shorten URL</button>

          <ul>

          </ul>


          <h1>Expand URL</h1>
          <input
            className='form-control'
            type="text"
            value={inputForExpand}
            onChange={e => setInputForExpand(e.target.value)}
            placeholder="Enter shortened URL to expand"
          />
          <button onClick={handleExpand} className='btn btn-success btn-lg'>Expand URL</button>

          {originalUrl && <p>Original URL: {originalUrl}</p>}
        </div>
        <div className='col-lg-9'>
        <h1>My list</h1>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Created At</th>
                <th scope="col">Original</th>
                <th scope="col">Short</th>
                <th scope="col">IP</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {useUrlStore.getState().urls.map(url => (
                <Row url={url} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
