import React, { Component } from 'react';
import { ajax } from './ajax';

const Loading = () => <h1>Loading, please wait...</h1>;

/**
 * withAjax:
 * While ajax(url) runs, render a loading component.
 * When ajax(url) completes render WrappedComponent using resToProps(ajax(url)) as props.
 */
const withAjax = (url, WrappedComponent, { LoadingComponent, resToProps }) => {
  // And return a new anonymous component
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = { resultObj: null };
      ajax(url).then(response => {
        this.setState({ resultObj: resToProps(response) });
      });
    }
    render() {
      const Loader = LoadingComponent || Loading;
      const { resultObj } = this.state;
      if (!resultObj) {
        return <Loader />;
      }
      const passedProps = { ...resultObj, ...this.props };
      return <WrappedComponent {...passedProps} />;
    }
  }
}

export { withAjax, Loading };
