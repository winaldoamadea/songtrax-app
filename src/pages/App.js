import { Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Header>
      </Header>
    </div>
  );
}

export default App;


function Header() {
  return (
    <header class="page-header">
      <div class="header-logo">
          <h2>
            <a><Link to="/music" className="header-icon-link">OgCiSum</Link></a>
          </h2>
      </div>
      <div class="header-app-description">
          <span>Create & Share Location Based Music Samples!</span>
      </div>
    </header>
  );
}