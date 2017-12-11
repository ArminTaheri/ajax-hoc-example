import React, { Component } from 'react';
import { Subject, Observable } from 'rxjs-es';

import { ajax } from './ajax';
import { withAjax } from './ajax-wrapper';

/**
 * withInfiniteScroll
 * @param  {Component} Wrapped      Component to extend with infinite scrolling
 * @param  {Function} resToList     How to extract the list if items from an ajax response
 * @param  {Function} resToNextURL  How to extract the nest URL to fetch from an ajax response
 * @param  {Function} listToProps   Transform the list from resToList into a props object for the Wrapped component.
 * @return {Component}
 */
const withInfiniteScroll = (Wrapped, { resToList, resToNextURL, listToProps }) => {
  class InfiniteScroll extends Component {
    constructor(props) {
      super(props);
      this.state = { list: props.list, next: props.next, loading: false };
      this.scrollEvent = new Subject();
      /* Use rxjs to responde to wheel and scroll events.
       * Notice in withAjax we used promises for one-time ajax resolves.
       * In withInfiniteScroll we expect multiple scroll events.
       * Observables model this simply.
       */
      this.scrollEvent
        .map(e => {
          const { scrollHeight, scrollTop, clientHeight } = e.target;
          return { scrollHeight, scrollTop, clientHeight };
        })
        .filter(s => ((s.scrollTop + s.clientHeight) / s.scrollHeight) > 0.95)
        .exhaustMap(() => Observable.fromPromise(this.fetchNext()))
        .subscribe(response => {
          const list = this.state.list.concat(resToList(response));
          this.setState({ list, next: resToNextURL(response), loading: false });
        });
    }
    fetchNext() {
      this.setState({ loading: true });
      return ajax(this.state.next);
    }
    componentWillUnMount() {
      this.scrollEvent.unsubscribe();
    }
    render() {
      const { list } = this.state;
      const transformedProps = listToProps instanceof Function ? listToProps(list) : { list };
      let passedProps = {};
      { // Extract wrapper specific props before passing to Wrapped.
        const { list, next, ...restProps } = this.props
        passedProps = { ...transformedProps, ...restProps };
      }
      const style = {
        overflowX: 'hidden',
        overflowY: 'scroll',
        maxHeight: '300px',
      };
      const scroll = e => this.scrollEvent.next(e);
      return (
        <div style={style} onScroll={scroll} onWheel={scroll}>
          <Wrapped { ...passedProps } />
          {this.state.loading ? <h3>Loading... </h3> : null}
        </div>
      );
    }
  }
  // the initial load can be done using withAjax on the InfinityScroll-wrapped component.
  return withAjax(InfiniteScroll, {
    resToProps: response => ({ list: resToList(response), next: resToNextURL(response) })
  });
}

export { withInfiniteScroll };
