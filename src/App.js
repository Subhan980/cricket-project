
import './App.css';
import Card from './component/Card';
import News from './component/News';
import Navbar from './component/Navbar';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Footer from './component/Footer';

function App() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;
 

  
  return (
    <>
    
    <Router><Navbar />

      

          
          
          
            <Switch>
            <Route exact path="/"><Card key="top" match="Live Matches" category="live"/></Route>
            <Route exact path="/recent"><Card  key="result" match="Recent Matches" category="recent" /></Route>
            <Route exact path="/upcoming"><Card key="fixture" match="Upcoming Matches" category="upcoming"  /></Route>
            <Route exact path="/news"><News key="News"/></Route>
            </Switch>
          
          

            
            
          
         
          
        </Router>

        
        
    
        <Footer/>
    </>
   
    
    
  );
}

export default App;
