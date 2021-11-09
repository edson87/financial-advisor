import Header from './components/Header';
import RiskPreferences from './components/RiskPreferences';
import { Provider } from 'react-redux'
import {BrowserRouter as Router,  Switch, Route} from "react-router-dom";
import store from './redux/store'
import '@progress/kendo-theme-default/dist/all.css';

import FormRiskCalculation from './components/FormRiskCalculation';

function App() {
  return (
    <Router>
      <Provider store={store}>
      <div className="">   
        <header className="">
          <Header />
          <Switch>
            <Route path='/' exact component={RiskPreferences} />
            <Route path='/calculator' component={FormRiskCalculation} />
          </Switch>
        </header>
      </div>
    </Provider>
    </Router>
  );
}

export default App;
