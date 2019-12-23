import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Route, Switch, withRouter, Redirect} from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core'

import { faTwitter } from '@fortawesome/fontawesome-free-brands'
import { faFacebook } from '@fortawesome/fontawesome-free-brands'
import { faInstagram } from '@fortawesome/fontawesome-free-brands'
import { faSave, faEdit, faTrashAlt, faTimesCircle, faSync, faSpinner, faShoppingBag, faTshirt, faMitten, faSocks, faShoePrints } from '@fortawesome/free-solid-svg-icons'
import { faShare } from '@fortawesome/free-solid-svg-icons'
import { faFolder } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'


import * as actions from './store/actions/index';
import ModelBuilder from './containers/ModelBuilder/ModelBuilder'
import Layout from './hoc/Layout/Layout';
import About from './OtherRoutes/About/About';
import Faq from './OtherRoutes/FAQ/FAQ';
import Materials from './OtherRoutes/Materials/Materials';
import Privacy from './OtherRoutes/Privacy/Privacy';
import Shipping from './OtherRoutes/Shipping/Shipping';
import ToS from './OtherRoutes/ToS/ToS';


class App extends Component {


    componentDidMount () {
        this.props.onTryAutoLogin();
    }

    render() {

        library.add(faTwitter);
        library.add(faFacebook);
        library.add(faInstagram);
        library.add(faSave);
        library.add(faShare);
        library.add(faFolder);
        library.add(faUser);
        library.add(faTrashAlt);
        library.add(faEdit);
        library.add(faTimesCircle);
        library.add(faSync);
        library.add(faSpinner);
        library.add(faShoppingBag);
        library.add(faTshirt);
        library.add(faMitten);
        library.add(faSocks);
        library.add(faShoePrints);

        let routes = (
          <Switch>
            <Route path="/" exact component={ModelBuilder} />
            <Route path="/about" exact component={About} />
            <Route path="/faq" exact component={Faq} />
            <Route path="/ToS" exact component={ToS} />
            <Route path="/shipping" exact component={Shipping} />
            <Route path="/materials" exact component={Materials} />
            <Route path="/privacy" exact component={Privacy} />
            <Redirect to='/'>
                <ModelBuilder />
            </Redirect>
          </Switch>
        );

        return (
          <div className="App">
                <Layout>
                  {routes}
                </Layout>
          </div>
      );
    }
}

const mapStateToProps = state => {
    return {
        isFinishedLoading: state.modelBuilder.loading !== true,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoLogin: () => dispatch(actions.authCheckState())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
