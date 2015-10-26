var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router');
var { Router, Route, Link, IndexRoute } = require('react-router');

var observer = require('omnipotent/decorator/observer');
var immstruct = require('immstruct');
var component = require('omniscient');
component.debug();

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

// No need for Omniscient optimization (we want this to always re-render)
// So use vanilla React stateless component
var App = function App (props) {
  return (
    <div>
      <ul>
        <li><Link to="/even">Even</Link></li>
        <li><Link to="/odd">Odd</Link></li>
        <li><Link to="/nested-route">Nested route</Link></li>
      </ul>
      <button onClick={toggleUpdates}>toggle automatic updates</button>
      {props.children}
    </div>
  );
};

var Even = component(function Even ({ even }) {
  return <p>
    Even {even.deref()}
    <button onClick={ _ => even.update(inc)}>increase</button>
  </p>;
});

var Odd = component(function Odd ({ odd }) {
  return <p>
    Odd {odd.deref()}
    <button onClick={ _ => odd.update(inc)}>increase</button>
  </p>;
});

// Decorate Even and Odd to auto update when they change internally
// Make it fit as a component to a route.
// RouterEven and RouterOdd will listen to the path provided as value,
// and give a cursor named the same as the property to the compoennt.
// Virtually creating a local render loop.
// Read more here: https://github.com/omniscientjs/omnipotent
var RouterEven = observer(data, {
  even: ['even'] // key path in structure
}, Even);

var RouterOdd = observer(data, {
  odd: ['odd'] // key path in structure
}, Odd);

// No need for Omniscient optimization (we want this to always re-render)
// So use vanilla React stateless component
var OuterRoute = function (props) {
  return <div>
    <p>Outer route</p>
    <ul>
      <li><Link to="/nested-route">Nested route</Link></li>
      <li><Link to="/another-nested-route">Another nested route</Link></li>
    </ul>
    {props.children}
  </div>;
};

var NestedRoute = component(function Nested () {
  return <p>Nested route was rendered on {String(new Date())}</p>;
});

var AnotherNestedRoute = component(function AnotherNested () {
  return <p>Another nested route was rendered on {String(new Date())}</p>;
});

ReactDOM.render((
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={RouterEven} />
      <Route path="/even" component={RouterEven} />
      <Route path="/odd" component={RouterOdd} />
      <Route path="/outer-route" component={OuterRoute}>
        <Route path="/nested-route" component={NestedRoute}/>
        <Route path="/another-nested-route" component={AnotherNestedRoute}/>
      </Route>
    </Route>
  </Router>
), document.querySelector('#app'));

function inc (m) {
  return m + 2;
}
