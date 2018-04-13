// <meta name="data-cache-{key}" value="{json}">

import React, { Component } from 'react';

const usedKeys = new Set();

function DefaultLoading() {
  return <div>Loading...</div>;
}

function createCacheMeta(cacheKey, data) {
  try {
    let json = typeof data === 'string' ? data : JSON.stringify(data);
    let meta = document.createElement('meta');
    meta.name = `data-cache-${cacheKey}`;
    meta.content = json;
    document.head.appendChild(meta);
  } catch(er) {
    // Probably not JSON
  }
}

function getFromCache(cacheKey) {
  let selector = `meta[name=data-cache-${cacheKey}]`;
  let meta = document.querySelector(selector);
  if(meta) {
    let type = meta.dataset.contentType;
    let json = meta.content;
    return JSON.parse(json);
  }
}

export class PageCacheProvider extends Component {
  constructor() {
    super();
    this.state = {
      item: null,
      isLoading: false
    };

    this.invalidate = this.invalidate.bind(this);
  }

  componentWillMount() {
    let {cacheKey} = this.props;

    if(!usedKeys.has(cacheKey)) {
      usedKeys.add(cacheKey);
      let item = getFromCache(cacheKey);
      if(item) {
        this.setState({item});
        return;
      }
    }

    this.setState({isLoading: true});
    this.fetchAndSave();
  }

  invalidate() {
    this.setState({isLoading: true});
    this.fetchAndSave();
  }

  componentDidMount() {
    if(this.props.invalidate) {
      this.props.invalidate(this.invalidate);
    }
  }

  fetchAndSave() {
    let {cacheKey, fetch} = this.props;

    Promise.resolve(fetch()).then(item => {
      createCacheMeta(cacheKey, item);
      this.setState({
        item,
        isLoading: false
      });
    });
  }

  render() {
    let {render} = this.props;
    let Loading = this.props.Loading || DefaultLoading;
    let {isLoading, item} = this.state;

    if(isLoading) {
      return <Loading />
    }

    return render(item);
  }
}
