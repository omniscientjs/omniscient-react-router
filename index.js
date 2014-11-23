var React = require('react');
var Router = require('react-router');
var { Route, DefaultRoute, RouteHandler, Link } = Router;

var Compa = require('./comp-a').jsx;
var Compb = require('./comp-b').jsx;

var App = React.createClass({
  render: function () {
    return (
      <div>
        <ul>
          <li><Link to="comp-a">Comp-a</Link></li>
          <li><Link to="comp-b">Comp-b</Link></li>
        </ul>
        <RouteHandler/>
      </div>
    );
    }
});

var Home = React.createClass({
  render: function () {
    return <h1>Home</h1>;
  }
});

var routes = (
  <Route handler={App}>
    <DefaultRoute handler={Home}/>
    <Route name="comp-a" handler={Compa}/>
    <Route name="comp-b" handler={Compb}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});
