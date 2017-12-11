import React from 'react';
import { withAjax } from './examples/ajax-wrapper'
import { withInfiniteScroll } from './examples/infinite-scroll';
import './App.css';

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

const StoreView = withAjax(ItemList, {
  resToProps: response => ({ items: response.body.items })
});

const StoreViewAlt = withAjax(ItemList, {
  resToProps: response => ({ items: response.body.items }),
  LoadingComponent: () => <h1 style={{ color: '#900' }}>Loading in red...</h1>
});

const InfiniteStore = withInfiniteScroll(ItemList, {
  listToProps: list => ({ items: list }),
  resToList: response => response.body.items,
  resToNextURL: response => response.body.next
});

const App = () =>
  <div>
    <StoreView title="Snacks" url='http://fakesite.com/carts/1' />
    <StoreViewAlt title="Entrees" url='http://fakesite.com/carts/2' />
    <InfiniteStore title="Infinite Menu" url='http://fakesite.com/carts/1' />
  </div>;

export default App;
