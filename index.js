'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageCacheProvider = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // <meta name="data-cache-{key}" value="{json}">

var usedKeys = new Set();

function DefaultLoading() {
  return _react2.default.createElement(
    'div',
    null,
    'Loading...'
  );
}

function createCacheMeta(cacheKey, data) {
  try {
    var json = typeof data === 'string' ? data : JSON.stringify(data);
    var meta = document.createElement('meta');
    meta.name = 'data-cache-' + cacheKey;
    meta.content = json;
    document.head.appendChild(meta);
  } catch (er) {
    // Probably not JSON
  }
}

function getFromCache(cacheKey) {
  var selector = 'meta[name=data-cache-' + cacheKey + ']';
  var meta = document.querySelector(selector);
  if (meta) {
    var type = meta.dataset.contentType;
    var json = meta.content;
    return JSON.parse(json);
  }
}

var PageCacheProvider = exports.PageCacheProvider = function (_Component) {
  _inherits(PageCacheProvider, _Component);

  function PageCacheProvider() {
    _classCallCheck(this, PageCacheProvider);

    var _this = _possibleConstructorReturn(this, (PageCacheProvider.__proto__ || Object.getPrototypeOf(PageCacheProvider)).call(this));

    _this.state = {
      item: null,
      isLoading: false
    };

    _this.invalidate = _this.invalidate.bind(_this);
    return _this;
  }

  _createClass(PageCacheProvider, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var cacheKey = this.props.cacheKey;


      if (!usedKeys.has(cacheKey)) {
        usedKeys.add(cacheKey);
        var item = getFromCache(cacheKey);
        if (item) {
          this.setState({ item: item });
          return;
        }
      }

      this.setState({ isLoading: true });
      this.fetchAndSave();
    }
  }, {
    key: 'invalidate',
    value: function invalidate() {
      this.setState({ isLoading: true });
      this.fetchAndSave();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.invalidate) {
        this.props.invalidate(this.invalidate);
      }
    }
  }, {
    key: 'fetchAndSave',
    value: function fetchAndSave() {
      var _this2 = this;

      var _props = this.props,
          cacheKey = _props.cacheKey,
          fetch = _props.fetch;


      Promise.resolve(fetch()).then(function (item) {
        createCacheMeta(cacheKey, item);
        _this2.setState({
          item: item,
          isLoading: false
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var render = this.props.render;

      var Loading = this.props.Loading || DefaultLoading;
      var _state = this.state,
          isLoading = _state.isLoading,
          item = _state.item;


      if (isLoading) {
        return _react2.default.createElement(Loading, null);
      }

      return render(item);
    }
  }]);

  return PageCacheProvider;
}(_react.Component);