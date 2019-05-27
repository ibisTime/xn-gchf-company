import echarts from 'echarts';

export function Round(config) {
    if(config.ref) {
        let myChart = echarts.init(config.ref);
        let option = {
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
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
            xAxis: [
                {
                    type: 'category',
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '蒸发量',
                    type: 'bar',
                    data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                },
                {
                    name: '降水量',
                    type: 'bar',
                    data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                },
                {
                    name: '下水量',
                    type: 'bar',
                    data: [2.2, 5.2, 9.0, 26.4, 22.7, 70.7, 175.6, 182.2, 42.7, 18.8, 6.0, 2.3]
                },
                {
                    name: '跳水量',
                    type: 'bar',
                    data: [2.2, 5.2, 9.0, 26.4, 22.7, 70.7, 175.6, 182.2, 42.7, 18.8, 6.0, 2.3]
                }
            ]
        };
        myChart.setOption(option);
    }
}