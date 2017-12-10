import React from 'react';
import { withAjax } from './examples/ajax-list'
import { withInfiniteScroll } from './examples/infinite-scroll';
import './App.css';

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

const StoreView = withAjax('http://fakesite.com/carts/1', ItemList, {
  resToProps: response => ({ items: response.body.items })
});

const StoreViewAlt = withAjax('http://fakesite.com/carts/2', ItemList, {
  resToProps: response => ({ items: response.body.items }),
  LoadingComponent: () => <h1 style={{ color: '#900' }}>Loading in red...</h1>
});

const InfiniteStore = withInfiniteScroll('http://fakesite.com/carts/1', ItemList, {
  listToProps: list => ({ items: list }),
  resToList: response => response.body.items,
  resToNextURL: response => response.body.next
});

const App = () =>
  <div>
    <StoreView title="Snacks" />
    <StoreViewAlt title="Entrees" />
    <InfiniteStore title="Infinity Menu" />
  </div>;

export default App;
