import React, { Component } from 'react';
import { Subject, Observable } from 'rxjs-es';

import { ajax } from './ajax';
import { withAjax } from './ajax-list';

const withInfiniteScroll = (initUrl, Wrapped, { resToList, resToNextURL, listToProps }) => {
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
      const passedProps = { ...transformedProps, ...this.props };
      // Show small div for demoing infinite scroll
      const style = {
        overflowX: 'hidden',
        overflowY: 'scroll',
        maxHeight: '300px',
        width: '350px'
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
  return withAjax(initUrl, InfiniteScroll, {
    resToProps: response => ({ list: resToList(response), next: resToNextURL(response) })
  });
}

export { withInfiniteScroll };
