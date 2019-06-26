import echarts from 'echarts';

export function Round(config) {
    if(config.ref) {
        let myChart = echarts.init(config.ref);
        let option = {
            color: ['#55DA8F', '#FE5E3A', '#FEBD4B', '#639DFC', '#FC9863', '#63D7FC', '#CF63FC', '#FC63E3', '#636BFC', '#78EFEE'],
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    avoidLabelOverlap: false,
                    radius: ['50%', '70%'],
                    data: config.data ? config.data : []
                }
            ]
        };
        myChart.setOption(option);
    }
}

export function LineMap(config) {
    if(config.ref) {
        let myChart = echarts.init(config.ref);
        let option = {
            textStyle: {
                color: '#fff'
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['离职人次', '入职人次', '出工人次']
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '离职人次',
                    type: 'bar',
                    barGap: '-100%',
                    color: '#6A9BFD',
                    data: config.data1 ? config.data1 : []
                },
                // {
                //     name: '请假人次',
                //     type: 'bar',
                //     barGap: '-100%',
                //     color: '#34EFEF',
                //     data: config.data2 ? config.data2 : []
                // },
                {
                    name: '入职人次',
                    type: 'bar',
                    barGap: '-100%',
                    color: '#37E36A',
                    data: config.data3 ? config.data3 : []
                },
                {
                    name: '出工人次',
                    type: 'bar',
                    barGap: '-100%',
                    color: '#FFDA48',
                    data: config.data4 ? config.data4 : []
                }
            ]
        };
        myChart.setOption(option);
    }
}