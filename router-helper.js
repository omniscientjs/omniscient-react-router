var React = require('react');
var component = require('omniscient').withDefaults({
  jsx: true
});

var RouterHelper = function (Handler, structure, path) {
  var listener;
  return component('Router' + Handler.displayName, {
    componentDidMount: function () {
      listener = (swappedPath) => {
        this.forceUpdate();
      };
      structure.on('swap', listener);
    },
    componentWillUnmount: function () {
      structure.off('swap', listener);
    }
  },function (props) {
    return <Handler {...props} cursor={structure.cursor(path)} />;
  });
};

module.exports = RouterHelper;