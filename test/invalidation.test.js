import React from 'react';
import { PageCacheProvider } from '../src/index';
import ReactDOM from 'react-dom';
import { wait } from './helpers';

describe('invalidation', () => {
  const node = document.createElement('div');

  afterEach(() => {
      ReactDOM.unmountComponentAtNode(node);
  })

  it('provides an invalidate function', () => {
    let given = false;
    function provideInvalidate(invalidate) {
      given = typeof invalidate === 'function';
    }

    ReactDOM.render(
      <PageCacheProvider
        cacheKey="test"
        fetch={() => {}}
        invalidate={provideInvalidate}
        render={() => <div></div>}
      />,
      node
    );

    expect(given).toBeTruthy();
  });

  it('can be used to force refetching', async () => {
    let count = 1;
    let then;

    function fetch() {
      if(count === 2) {
        then = Promise.resolve();
        return then;
      }
    }

    function provideInvalidate(invalidate) {
      then = wait(0).then(invalidate);
    }

    ReactDOM.render(
      <PageCacheProvider
        cacheKey="test"
        fetch={fetch}
        invalidate={provideInvalidate}
        render={() => <div>{count++}</div>}
      />,
      node
    );

    await then;

    expect(node.innerHTML).toContain('2');
  });
});
