import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [model, setModel] = useState('NA');
  const [apiKey, setApiKey] = useState('');
  const [hugModel, setHugModel] = useState('google/flan-t5-xl');
  const [hugToken, setHugToken] = useState('');
  const [temperature, setTemperature] = useState(0);
  const [maxLength, setMaxLength] = useState(512);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const handleModelChange = (event) => {
    setModel(event.target.value);
  };

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  const handleHugModelChange = (event) => {
    setHugModel(event.target.value);
  };

  const handleHugTokenChange = (event) => {
    setHugToken(event.target.value);
  };

  const handleTemperatureChange = (event) => {
    setTemperature(event.target.value);
  };

  const handleMaxLengthChange = (event) => {
    setMaxLength(event.target.value);
  };

  const handleConfigureModel = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const modelData = {
          model_name: model,
          api_key: apiKey,
          hug_model: hugModel,
          hug_token: hugToken,
          temperature: temperature,
          max_length: maxLength,
        };

        const configResponse = await axios.post('http://localhost:5000/configure-model', modelData);
        if (configResponse.status === 200) {
          setResult('Model Built');
        } else {
          setResult('Error occurred');
        }
      } else {
        setResult('Please upload correct PDF!');
      }
    } catch (error) {
      setResult('Error occurred');
    }

    setLoading(false);
  };

  return (
    <div className="App">
      <div>
        <h1>PDF Ingestion</h1>
        <input type="file" accept=".pdf" onChange={handleFileUpload} />
        <button onClick={handleConfigureModel} disabled={!file || loading}>
          Upload & Ingest
        </button>
      </div>
      <div>
        <h1>Select Model</h1>
        <select value={model} onChange={handleModelChange}>
          <option value="NA">NA</option>
          <option value="OpenAI">OpenAI</option>
          <option value="HuggingFace">HuggingFace</option>
        </select>
        {model === 'OpenAI' && (
          <div>
            <input
              type="text"
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="OPENAI API KEY"
            />
          </div>
        )}
        {model === 'HuggingFace' && (
          <div>
            <select value={hugModel} onChange={handleHugModelChange}>
              <option value="google/flan-t5-xl">google/flan-t5-xl</option>
            </select>
            <input
              type="text"
              value={hugToken}
              onChange={handleHugTokenChange}
              placeholder="HUGGINGFACE API TOKEN"
            />
          </div>
        )}
        <div>
          <input
            type="number"
            value={temperature}
            onChange={handleTemperatureChange}
            placeholder="Temperature"
          />
          <input
            type="number"
            value={maxLength}
            onChange={handleMaxLengthChange}
            placeholder="Max Token Length"
          />
          <button onClick={handleConfigureModel} disabled={loading}>
            Configure Model
          </button>
        </div>
      </div>
      <div>
        <h1>Response</h1>
        <p>{result}</p>
      </div>
    </div>
  );
}

export default App;

