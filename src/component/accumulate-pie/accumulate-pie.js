import React from 'react';
import { Chart, Geom, Tooltip, Coord, Guide } from 'bizcharts';
import DataSet from '@antv/data-set';

const { DataView } = DataSet;
const { Html } = Guide;

export default class AccumulatePie extends React.Component {
  render() {
    const data = [{
      item: '累计人数',
      count: this.props.data
    }];
    const dv = new DataView();
    dv.source(data).transform({
      type: 'percent',
      field: 'count',
      dimension: 'item',
      as: 'percent'
    });
    const cols = {
      percent: {
        formatter: val => val
      }
    };

    let height = window.innerHeight * 0.16576087;
    return (
      <Chart data={dv} scale={cols} height={height} padding={[ 0, 0, 0, 0 ]} forceFit>
        <Coord type={'theta'} radius={0.85} innerRadius={0.75} />
        <Tooltip
          showTitle={false}
          itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
          />
        <Guide >
          <Html position ={[ '50%', '50%' ]} html={'<div style="color:#fff;font-size:12;text-align: center;width: 10em;">总人数<br><span style="color:#fff;font-size:12">' + this.props.data + '</span>人</div>'} alignX='middle' alignY='middle'/>
        </Guide>
        <Geom
          type="intervalStack"
          position="percent"
          color='item'
          tooltip={['item*percent', (item, percent) => {
            return {
              name: item,
              value: percent
            };
          }]}
          >
        </Geom>
      </Chart>
    );
  }
}
