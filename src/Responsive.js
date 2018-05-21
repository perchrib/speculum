import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
// Users/per/Projects/Speculum/speculum/node_modules/react-grid-layout/css/styles.css
import 'react-grid-layout/css/styles.css'
//import '../node_modules/react-grid-layout/css/styles.css'
// import '../node_modules/react-resizable/css/styles.css'
import App from './App'
import Clock from './Feature/Clock/Clock'
const ResponsiveGridLayout = WidthProvider(Responsive);

const red = {
  background: 'red'
};
const blue = {
  background: 'blue'
};
const yellow = {
  background: 'yellow'
};

class MyResponsiveGrid extends React.Component {
  render() {
    // {lg: layout1, md: layout2, ...}
        var layout = [
      {i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
      {i: 'b', x: 1, y: 0, w: 6, h: 2, minW: 6, maxW:6, maxH:4},
      {i: 'c', x: 4, y: 5, w: 5, h: 5}
    ];
    var layouts = {lg: layout}
    return (
      <ResponsiveGridLayout className="layout" layouts={layouts}
        breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
        cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}>
        <div key="a" style={red}>Autosize</div>
        <div key="b" style={yellow}><Clock /> </div>
        <div key="c" style={blue}>3</div>
      </ResponsiveGridLayout>
    )
  }
}

export default MyResponsiveGrid