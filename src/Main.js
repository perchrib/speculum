import React, { Component } from 'react';
import _ from "lodash";
import RGL, { WidthProvider } from "react-grid-layout";
import GridLayout from 'react-grid-layout';
//import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import Clock from './Feature/Clock/Clock';

const ReactGridLayout = WidthProvider(RGL);

class BasicLayout extends Component {
  static defaultProps = {
    className: "layout",
    items: 20,
    rowHeight: 30,
    onLayoutChange: function() {},
    cols: 12
  };

  constructor(props) {
    super(props);

    const layout = this.generateLayout();
    this.state = { layout };
  }

  generateDOM() {
    return _.map(_.range(this.props.items), function(i) {
      return (
        <div key={i}>
          <span className="text">{i}</span>
        </div>
      );
    });
  }

  generateLayout() {
    const p = this.props;
    return _.map(new Array(p.items), function(item, i) {
      const y = _.result(p, "y") || Math.ceil(Math.random() * 4) + 1;
      return {
        x: (i * 2) % 12,
        y: Math.floor(i / 6) * y,
        w: 2,
        h: y,
        i: i.toString()
      };
    });
  }

  onLayoutChange(layout) {
    this.props.onLayoutChange(layout);
  }

  render() {
    return (
      <ReactGridLayout
        layout={this.state.layout}
        onLayoutChange={this.onLayoutChange}
        {...this.props}
      >
        {this.generateDOM()}
      </ReactGridLayout>
    );
  }
}

class OtherMain extends Component {
    render() {
    // layout is an array of objects, see the demo for more complete usage
    
    var layout = [
      {i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
      {i: 'b', x: 1, y: 0, w: 3, h: 2},
      {i: 'c', x: 3, y: 5, w: 7, h: 4}
    ];

    return (
      <GridLayout className="layout" cols={12} rowHeight={50} width={1800} 
        style={{'backgroundColor': 'black'}} compactType='vertical' autoSize={false} useCSSTransforms={true}>
        <div key="a" style={{'backgroundColor': 'CornflowerBlue'}} data-grid={{i: 'a', x: 0, y: 0, w: 1, h: 2, static: true}}></div>
        <div key="b" style={{'backgroundColor': 'Chartreuse'}} data-grid={{i: 'b', x: 1, y: 0, w: 3, h: 2}}>1fffdffdfdfdfd
        fdfdfdf
        fddffdfgfghdfghdf
        dfdfdfdfdfdfdfd
        fdfdfdffdfdfdf
        fdfdjfdhjfdjff fdhjf dhj fhdjf dhjf dhjf dhjf hfjdhjf
        fdfdhfdjhfjfdfdfd
        fdfdfdfdffjdfjkdjfd
        fdfdkjfkdfjkd
        fdfdkjfkdfjkdfdkfjk

        fjdkfjkfjd
        nfndfjkfjkd</div>
        <div key="c" style={{'backgroundColor': 'gold'}} data-grid={{i: 'c', x: 3, y: 5, w: 7, h: 4}}><Clock /></div>
      </GridLayout>
    )
  }
  onResize(item){
    console.log(item);
  }
}

export {OtherMain, BasicLayout}
