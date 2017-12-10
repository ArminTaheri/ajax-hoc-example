import React, { Component } from 'react';
import './App.css';

// Mock AJAX endpoint
const ENDPOINT = {
  'http://fakesite.com/carts/1': {
    body: {
      items: [
        { name: 'banana', price: 3 },
        { name: 'apple', price: 5 },
        { name: 'chicken', price: 18 },
      ]
    }
  },
  'http://fakesite.com/carts/2': {
    body: {
      items: [
        { name: 'toast', price: 1 },
        { name: 'eggs', price: 3 },
        { name: 'pancakes', price: 7 },
      ]
    }
  }
};

// Fake ajax endpoint with a random delay.
const ajax = url => new Promise(resolve => {
  const response = ENDPOINT[url];
  // Simulated delay by some fraction of 10 of 2000ms
  const ajaxDelay = 2000 + 1000 * Math.floor(Math.random() * 10) / 10;
  setTimeout(() => resolve(response), ajaxDelay);
});



// --------- Library maintainer point of view -----------------------------------------
const Loading = () => <h1>Loading, please wait...</h1>

/**
 * withAjax:
 * While ajax(url) runs, render a loading component.
 * When ajax(url) completes render WrappedComponent using transform(ajax(url)) as props.
 */
const withAjax = (WrappedComponent, url, { LoadingComponent, transform }) => {
  // And return a new anonymous component
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = { resultObj: null };
      ajax(url).then(response => {
        this.setState({ resultObj: transform(response) });
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



// ------------- Developer's Point of view ------------------------------------------
const ItemList = ({ title, items }) => {
  const list = items.map(({ name, price }, i) => (
    <li key={i}>{name}: ${price}</li>
  ));
  return (
    <div>
      <h2>{title}:</h2>
      <ul>{list}</ul>
    </div>
  );
};


const StoreView = withAjax(ItemList, 'http://fakesite.com/carts/1', {
  transform: response => ({ items: response.body.items })
});

const StoreViewAlt = withAjax(ItemList, 'http://fakesite.com/carts/2', {
  transform: response => ({ items: response.body.items }),
  LoadingComponent: () => <h1 style={{ color: '#900' }}>Loading in red...</h1>
});


const App = () =>
  <div>
    <StoreView title="Snacks" />
    <StoreViewAlt title="Entrees" />
  </div>;

export default App;
