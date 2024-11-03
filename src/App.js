import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Home from "./componets/pages/Home";
import Company from "./componets/pages/Company";
import Contact from "./componets/pages/Contact";
import NewProject from "./componets/pages/NewProject";
import Projects from "./componets/pages/Projects";
import Project from "./componets/pages/Project";
import Container from "./componets/layout/Container";
import NavBar from "./componets/layout/NavBar";
import Footer from "./componets/layout/Footer";

function App() {  
  return (
    <Router>
        <NavBar />
      <Container customClass="min-height">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/projects" element={<Projects />} />
          <Route exact path="/company" element={<Company />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/newproject" element={<NewProject />} />
          <Route exact path="/project/:id" element={<Project />} />
        </Routes>
      </Container>
      <Footer />
    </Router>
  )
}


export default App;
