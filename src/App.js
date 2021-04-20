import Plot from './Plot';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          Collaborative plot
        </div>
      </header>
      <Plot
        width={850}
        height={650}
      />
    </div>
  );
}

export default App;
