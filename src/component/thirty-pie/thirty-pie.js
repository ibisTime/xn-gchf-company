import React from 'react';
import { Chart, Geom, Tooltip, Coord, Guide, Legend } from 'bizcharts';
import DataSet from '@antv/data-set';

const { DataView } = DataSet;
const { Html } = Guide;

export default class ThirtyPie extends React.Component {
  render() {
    const data = [{
      item: '离职人次',
      count: +this.props.staffOut
    }, {
      item: '请假人次',
      count: +this.props.leavingDays
    }, {
      item: '入职人次',
      count: +this.props.staffIn
    }, {
      item: '出工人次',
      count: +this.props.workingDays
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
      <Chart data={dv} scale={cols} height={height} padding={[ 0, 0, 0, 40 ]} forceFit>
        <Coord type={'theta'} radius={0.85} innerRadius={0.75} />
        <Tooltip
          showTitle={false}
            itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
          />
        <Legend
          marker='square'
          position='left'
          offsetY={-10}
          offsetX={44}
          textStyle={{
            fill: '#ffffff'
          }}
          itemFormatter={(item) => {
            return item + ' ' + data.filter(v => v.item === item)[0].count;
          }} />
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
