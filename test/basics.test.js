import React from 'react';
import { PageCacheProvider } from '../index';
import ReactDOM from 'react-dom';

describe('fetching', () => {
  const node = document.createElement('div');

  afterEach(() => {
      ReactDOM.unmountComponentAtNode(node);
  })

  it('calls the fetch function', async () => {
    let then;

    function fetch() {
      then = Promise.resolve({name: 'World'});
      return then;
    }

    ReactDOM.render(
      <PageCacheProvider
        cacheKey="test"
        fetch={fetch}
        render={({name}) => <div>{name}</div>}
      />,
      node
    );

    await then;
    expect(node.innerHTML).toContain('World');
  });
});
