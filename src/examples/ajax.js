// Mock AJAX endpoint
const ENDPOINT = {
  'http://fakesite.com/carts/1': {
    body: {
      items: [
        { name: 'banana', price: 3 },
        { name: 'apple', price: 5 },
        { name: 'chicken', price: 18 },
      ],
      next: 'http://fakesite.com/carts/2'
    }
  },
  'http://fakesite.com/carts/2': {
    body: {
      items: [
        { name: 'toast', price: 1 },
        { name: 'eggs', price: 3 },
        { name: 'pancakes', price: 7 },
      ],
      next: 'http://fakesite.com/carts/3'
    }
  },
  'http://fakesite.com/carts/3': {
    body: {
      items: [
        { name: 'kool-aid', price: 2 },
        { name: 'strudel', price: 5 },
        { name: 'soup', price: 3 },
      ],
      next: 'http://fakesite.com/carts/1'
    }
  }
}

// Fake ajax endpoint with a random delay.
const ajax = url => new Promise(resolve => {
  const response = ENDPOINT[url];
  // Simulated delay by some fraction of 10 of 2000ms
  const ajaxDelay = 1000 + 1000 * Math.floor(Math.random() * 10) / 10;
  setTimeout(() => resolve(response), ajaxDelay);
});

export { ajax };
