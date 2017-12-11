import React, { Component } from 'react';
import { ajax } from './ajax';

const Loading = () => <h1>Loading, please wait...</h1>;

/**
 * withAjax:
 * @param  {Component} WrappedComponent Component to wrap with props passed by ajax
 * @param  {Component} LoadingComponent Component to show while ajax completes
 * @param  {Function} resToProps        How to map ajax response to Props for WrappedComponent
 * @return {Component}
 */
const withAjax = (WrappedComponent, { LoadingComponent, resToProps }) => {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = { resultObj: null };
      this.cache = {};
      if (this.props.url) {
        this.runAjax(props.url);
      }
    }
    componentWillReceiveProps(props) {
      if (this.cache[props.url]) {
        this.setState({ resultObj: this.cache[props.url] });
        return;
      }
      this.runAjax(props.url)
    }
    runAjax(url) {
      ajax(url).then(response => {
        const resultObj = resToProps(response);
        this.cache[url] = resultObj;
        this.setState({ resultObj });
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
