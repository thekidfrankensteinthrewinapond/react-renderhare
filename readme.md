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

### Invalidating a fetch

Occasionally you might need to invalidate a fetch and force a new one. An example would be if you fetch a *session* for a user. When they are logged out the service might return a session for an unknown user, but when they log in you want to refetch the session to get the details of the user.

You can do so like below:

```js
import React, { Component } from 'react';
import { PageCacheProvider } from 'react-renderhare';
import UserProfile from './UserProfile';

class HomePage extends Component {
  fetchSession = () => {
    return fetch('/api/session').then(r => r.json());
  }

  logout = () => {
    let { invalidate } = this.state;

    // Invalidate the session fetch, forcing a refetch
    invalidate();
  }

  render() {
    return (
      <div>
        <PageCacheProvider
          cacheKey="session"
          fetch={this.fetchSession}
          invalidate={invalidate => this.setState({ invalidate })}
          render={session => (
            session ? <UserProfile session={session} /> : <div>Logged out</div>
          )}
        />

        <button onClick={this.logout}>Logout</button>
      </div>
    )
  }
}

export default HomePage;
```

In the above we:

1. Pass a function into the `invalidate` prop.
2. When that function is called we save the function it provides to our state.
3. When the user logs out, we call that function, which will trigger `PageCacheProvider` to refetch the session.

### PageCacheProvider

The `PageCacheProvider` components takes 3 props:

* __cacheKey__: A key used to save the request for later usage in the client. Should be unique.
* __fetch__: A function that gets called to make the actual request. This is where you'd use `fetch()` or your favorite XHR library to get JSON from your API.
* __render__: A [render prop](https://reactjs.org/docs/render-props.html) that is called when the fetch request is complete. It will be provided the result of the request.
* __invalidate__: Takes a function that returns a function. Use this function if you ever need to invalidate and force a new fetch.

```jsx
<PageCacheProvider cacheKey="todos" fetch={loadTodos} render={todos => <TodoList todos={todos}/>}></PageCacheProvider>
```

## License

MIT
