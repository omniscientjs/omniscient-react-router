var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, DefaultRoute, Link } = Router;

var RouterHelper = require('./router-helper');

var component = require('omniscient').withDefaults({ jsx: true });
component.debug();

var immstruct = require('immstruct');

var data = immstruct({ even: 0, odd: 1 });

var evenInterval, oddInterval;
function toggleUpdates () {
  if (evenInterval || oddInterval) {
    clearInterval(evenInterval);
    clearInterval(oddInterval);
    evenInterval = null;
    oddInterval = null;
  }
  else {
    evenInterval = setInterval(_ => data.cursor().update('even', inc), 100);
    oddInterval = setInterval(_ => data.cursor().update('odd', inc), 100);
  }
}

var alwaysRerender = { shouldComponentUpdate: () => true };

var App = component('App', [alwaysRerender], function () {
  return (
    <div>
      <ul>
        <li><Link to="even">Even</Link></li>
        <li><Link to="odd">Odd</Link></li>
        <li><Link to="nested-route">Nested route</Link></li>
      </ul>
      <button onClick={toggleUpdates}>toggle automatic updates</button>
      <RouteHandler {...this.props}/>
    </div>
  );
});

var Even = component('Even', function ({ cursor }) {
  return <p>Even {cursor.deref()} <button onClick={ _ => cursor.update(inc)}>increase</button></p>;
});

var Odd = component('Odd', function ({ cursor, statics }) {
  console.log('the route is', statics.path);
  return <p>Odd {cursor.deref()} <button onClick={ _ => cursor.update(inc)}>increase</button></p>;
});

var OuterRoute = component('Outer', [alwaysRerender], function () {
  return <div>
    <p>Outer route</p>
    <ul>
      <li><Link to="nested-route">Nested route</Link></li>
      <li><Link to="another-nested-route">Another nested route</Link></li>
    </ul>
    <RouteHandler />
  </div>;
});

var NestedRoute = component('Nested', function () {
  return <p>Nested route was rendered on {String(new Date())}</p>;
});
var AnotherNestedRoute = component('AnotherNested', function () {
  return <p>Another nested route was rendered on {String(new Date())}</p>;
});

var RouterEven = RouterHelper(Even, data, 'even');
var RouterOdd = RouterHelper(Odd, data, 'odd');

var routes = (
  <Route handler={App}>
    <DefaultRoute handler={RouterEven} />
    <Route name="even" handler={RouterEven} />
    <Route name="odd" handler={RouterOdd} />
    <Route name="outer-route" handler={OuterRoute}>
      <Route name="nested-route" handler={NestedRoute}/>
      <Route name="another-nested-route" handler={AnotherNestedRoute}/>
    </Route>
  </Route>
);

Router.run(routes, function (Handler, state) {
  React.render(<Handler cursor={data.cursor()} statics={state} />, document.body);
});

function inc (m) {
  return m + 2;
}
