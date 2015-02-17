var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, DefaultRoute, Link } = Router;

var component = require('omniscient');
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
}).jsx;

var Even = component(function ({ cursor }) {
  return <p>Even {cursor.deref()}</p>
}).jsx;

var Odd = component(function ({ cursor, statics }) {
  console.log('the route is', statics.path);
  return <p>Odd {cursor.deref()}</p>
}).jsx;

var routes = (
  <Route handler={App}>
    <DefaultRoute handler={Even}/>
    <Route name="even" handler={Even}/>
    <Route name="odd" handler={Odd}/>
  </Route>
);

Router.run(routes, rerender(data, document.body));

function rerender (structure, el) {
  var Handler, state;

  function render (h, s) {
    if (h) Handler = h;
    if (s) state = s;

    // swap cursors based on the route, or maybe something like
    // https://github.com/rackt/react-router/blob/master/examples/async-data/app.js#L134
    var cursor;
    switch (state.path) {
      case '/odd':
        cursor = structure.cursor('odd');
      break;
      default:
        cursor = structure.cursor('even');
      break;
    }

    React.render(<Handler cursor={cursor} statics={state} />, el);
  }

  structure.on('swap', function() {
    render();
  });

  return render;
}
