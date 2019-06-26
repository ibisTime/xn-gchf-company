import React from 'react';
import { Icon, Collapse, Table, Input, Button, message } from 'antd';
import {Round, LineMap} from 'component/charts/RoundMap';
import fetch, { fetchImg } from 'common/js/fetch';
import { formatDate, getUserKind, moneyFormat, isUndefined, getUserId } from 'common/js/util';
import { getProject, getProjectList, getPagePayCode, getPageChecks, getPageabnormal, getTotalSalary } from 'api/project';
import { getUserDetail } from 'api/user';
import './home.css';

const Box = ({ title, children, className, center }) => {
  return (
    <div className={`box-wrapper ${className}`}>
      <div className="box-title">
        {title}
      </div>
      <div className={`box-content ${center ? 'center-content' : ''}`}>
        {children}
      </div>
    </div>
  );
};

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        staffIn: 0,
        staffOut: 0,
        leavingDays: 0,
        workingDays: 0,
        banzhu: null,
        nianl: null,
        ljry: null,
        ageObj: {
            '0': '18岁以下',
          '1': '18-30岁',
          '2': '30-40岁',
          '3': '40-50岁',
          '4': '50-55岁',
          '5': '55岁以上'
        },
        zcrs: '',
        jrsb: '',
        ljgz: '',
        perConfig: {
            lz: 0,
            qj: 0,
            rz: 0,
            cg: 0
        }
    };
  }
  componentDidMount() {
      let hasMsg = message.loading('', 10);
      Promise.all([
          fetch(631618, { userId: getUserId() }), // 班组统计
          fetch(631609, { userId: getUserId() }), // 工种分组
          fetch(631604, { userId: getUserId() }), // 年龄分布
          fetch(631603, { userId: getUserId() }), // 项目概括
          fetch(631697, { userId: getUserId() }) // 30日累计人员情况
      ]).then(([data1, data2, data3, data4, data5]) => {
          this.setState({
              zcrs: data4[0].registeredTotal ? data4[0].registeredTotal : '0',
              jrsb: data4[0].todayWorkers ? data4[0].todayWorkers : '0',
              ljgz: data4[0].totalActualPayRoll ? data4[0].totalActualPayRoll : '0'
          });
          let arr1 = data1.data.map(item => ({
              value: item.count,
              name: `${item.team_name}(${item.count})`
          }));
          Round({
              ref: this.state.banzhu,
              data: arr1
          });
          let arr2 = data2.map(item => ({
              value: item.count,
              name: `${item.work_type}(${item.count})`
          }));
          Round({
              ref: this.state.gongz,
              data: arr2
          });
          let arr3 = data3.map(item => ({
              value: item.count,
              name: `${this.state.ageObj[item.ageInterval]}(${item.count})`
          }));
          Round({
              ref: this.state.nianl,
              data: arr3
          });
          let {leavingCount = 0, comingCount = 0, attendanceCount = 0} = data5;
          LineMap({
              ref: this.state.ljry,
              data1: [leavingCount, 0, 0],
              // data2: [0, 0, 0, 0],
              data3: [0, comingCount, 0],
              data4: [0, 0, attendanceCount]
          });
          this.setState({
              perConfig: {
                  lz: leavingCount,
                  qj: 0,
                  rz: comingCount,
                  cg: attendanceCount
              }
          });
          hasMsg();
      }, hasMsg);
      // this.camera();
  }
  camera() {
    navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMeddia || navigator.msGetUserMedia;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      }).then((stream) => {
        this.mediaStreamTrack = typeof stream.stop === 'function' ? stream : stream.getTracks()[1];
        this.playVideo(stream);
      }).catch(function (err) {
        console.log(err);
      });
    } else if (navigator.getMedia) {
      navigator.getMedia({
        video: true
      }, (stream) => {
        this.mediaStreamTrack = stream.getTracks()[0];
        this.playVideo(stream);
      }, function (err) {
        console.log(err);
      });
    }
  }
  playVideo(stream) {
    if (this.video.srcObject) {
      this.video.srcObject = stream;
    } else {
      this.video.src = (window.URL || window.webkitURL).createObjectURL(stream);
    }
    console.log(this.video.srcObject);
    setTimeout(() => {
      this.video.play();
    }, 300);
  }
  closeVideo() {
    this.mediaStreamTrack && this.mediaStreamTrack.stop();
  }
  render() {
    return (
      <div className="home-box">
          <div className="home-wrapper">
              <div className="wrapper-left">
                  <div id="container">
                      <video style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'fill'
                      }} ref={(video) => this.video = video} />
                      <div className="noVideo">
                          <p><span></span></p>
                          <p>暂无视频</p>
                      </div>
                  </div>
                  <div className="warp-foo">
                      <div className="warp-foo_left">
                          <Box title="项目概括" className="other-box">
                              <div className="sing-warp_box">
                                  <div className="sing-box">
                                      <div className="sing-left">
                                          <p>在册人员（人）</p>
                                          <h5>{this.state.zcrs}</h5>
                                      </div>
                                      <div className="sing-right">
                                          <p>今日上班（人）</p>
                                          <h5>{this.state.jrsb}</h5>
                                      </div>
                                  </div>
                                  <div className="all-box">
                                      <p>累计总发薪（元）</p>
                                      <h5>{this.state.ljgz}</h5>
                                  </div>
                              </div>
                          </Box>
                      </div>
                      <div className="warp-foo_right">
                          <Box title="30日累计人员情况" className="other-box ljry-box" style={{'boxShadow': '0 1px 0 0 #616C8F'}} center={true}>
                              <div className="ljry-content">
                                  <div className="ljry-box_left">
                                      <p><span className='lz'></span> 离职人次({this.state.perConfig.lz})</p>
                                      <p><span className='rz'></span> 入职人次({this.state.perConfig.rz})</p>
                                      <p><span className='cg'></span> 出工人次({this.state.perConfig.cg})</p>
                                  </div>
                                  <div className="ljry-box_right">
                                      <div ref={(ref) => { this.state.ljry = ref; }}
                                           style={{ width: '100%', height: '170%', marginTop: '-45px' }}>
                                      </div>
                                  </div>
                              </div>
                          </Box>
                      </div>
                  </div>
              </div>
              <div className="wrapper-right">
                  <div className="wrap-right_01">
                      <Box title="班组分布">
                          <div ref={(ref) => { this.state.banzhu = ref; }}
                               style={{ width: '100%', height: '100%' }}>
                          </div>
                      </Box>
                  </div>
                  <div className="wrap-right_02">
                      <Box title="工种分布" className="person-box" center={true}>
                          <div ref={(ref) => { this.state.gongz = ref; }}
                               style={{ width: '100%', height: '100%' }}>
                          </div>
                      </Box>
                  </div>
                  <div className="wrap-right_03">
                      <Box title="年龄分布" className="other-box" center={true}>
                          <div ref={(ref) => { this.state.nianl = ref; }}
                               style={{ width: '100%', height: '100%' }}>
                          </div>
                      </Box>
                  </div>
              </div>
          </div>
      </div>
    );
  }
}

export default Home;
