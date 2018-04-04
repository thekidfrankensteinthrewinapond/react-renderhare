# 🐰 react-renderhare

Components for easier integration with [RenderHare](https://renderhare.com/). Render your app on RenderHare, then reuse your API responses when rendered in the client.

## Install

Using npm:

```shell
npm install react-renderhare
```

Or [yarn](https://yarnpkg.com/en/):

```shell
yarn add react-renderhare
```

## Usage

__react-renderhare__ exports a `PageCacheProvider` component that will save API requests and then reuse them when rendered in the client.

Usage looks like:

```jsx
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import Orders from './Orders';
import { PageCacheProvider } from 'react-renderhare';

export default class extends Component {
  fetchOrders = () => {
    return fetch(`/api/orders`).then(r => r.json());
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>Order Pizza</title>
          <meta name="description" content="Order your favorite pizza pie" />
        </Helmet>

        <PageCacheProvider
          cacheKey="orders"
          fetch={this.fetchOrders}
          render={orders => (
            <Orders orders={orders} />
          )}
        />
      </div>
    );
  }
}
```

### PageCacheProvider

The `PageCacheProvider` components takes 3 props:

* __cacheKey__: A key used to save the request for later usage in the client. Should be unique.
* __fetch__: A function that gets called to make the actual request. This is where you'd use `fetch()` or your favorite XHR library to get JSON from your API.
* __render__: A [render prop](https://reactjs.org/docs/render-props.html) that is called when the fetch request is complete. It will be provided the result of the request.

```jsx
<PageCacheProvider cacheKey="todos" fetch={loadTodos} render={todos => <TodoList todos={todos}/>}></PageCacheProvider>
```

## License

MIT
