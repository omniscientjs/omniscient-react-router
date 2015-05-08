var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, DefaultRoute, Link } = Router;

var RouterHelper = require('./router-helper');

var component = require('omniscient').withDefaults({
  jsx: true
});
var immstruct = require('immstruct');

var data = immstruct({ even: 0, odd: 1 });
setInterval(_ => data.cursor().update('even', m => m + 2), 100);
setInterval(_ => data.cursor().update('odd',  n => n + 2), 100);

var App = component(function () {
  return (
    <div>
      <ul>
        <li><Link to="even">Even</Link></li>
        <li><Link to="odd">Odd</Link></li>
      </ul>
      <RouteHandler {...this.props}/>
    </div>
  );
});

var Even = component(function ({ cursor }) {
  return <p>Even {cursor.deref()}</p>
});

var Odd = component(function ({ cursor, statics }) {
  console.log('the route is', statics.path);
  return <p>Odd {cursor.deref()}</p>
});

var RouterEven = RouterHelper(Even, data, 'even');
var RouterOdd = RouterHelper(Odd, data, 'odd');

var routes = (
  <Route handler={App}>
    <DefaultRoute handler={RouterEven} />
    <Route name="even" handler={RouterEven} />
    <Route name="odd" handler={RouterOdd} />
  </Route>
);

Router.run(routes, function (Handler, state) {
  React.render(<Handler cursor={data.cursor()} statics={state} />, document.body);
});
