import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Route, Switch, withRouter, Redirect} from 'react-router-dom';
import LoadingScreen from 'react-loading-screen';

import * as actions from './store/actions/index';
import ModelBuilder from './containers/ModelBuilder/ModelBuilder'
import Layout from './hoc/Layout/Layout';
import About from './OtherRoutes/About/About';
import Faq from './OtherRoutes/FAQ/FAQ';
import Materials from './OtherRoutes/Materials/Materials';
import Privacy from './OtherRoutes/Privacy/Privacy';
import Shipping from './OtherRoutes/Shipping/Shipping';
import ToS from './OtherRoutes/ToS/ToS';
import SideDrawerColor from './components/UI/SideDrawerColor/SideDrawerColor';


class App extends Component {


    componentDidMount () {
        this.props.onTryAutoLogin();
    }

    render() {

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
             <LoadingScreen
                loading={false}
                bgColor='#f1f1f1'
                spinnerColor='#9ee5f8'
                textColor='#676767'
                logoSrc='/logo.png'
                text='Star Forge'>
                <Layout>
                  {routes}
                </Layout>
            </LoadingScreen>
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
