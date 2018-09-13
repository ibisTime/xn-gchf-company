import React from 'react';
import axios from 'axios';
import { Base64 } from 'js-base64';
import originJsonp from 'jsonp';
import { Select, Spin } from 'antd';
import './projectStaff-checkFeat.css';
import Photo from './touxiang.png';
import Figure from './figure.png';
import { getQueryString, getUserId, showWarnMsg, showSucMsg } from 'common/js/util';
import { mianguanPicture, getFeatInfo, getStaffDetail } from 'api/user';
import { queryStaffDetail } from 'api/staff';

const {Option} = Select;

function jsonp(url, data, option) {
  return new Promise((resolve, reject) => {
    originJsonp(url + '?' + data, {
      name: 'getFaceFeature'
    }, (err, data) => {
      if(!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}

class mianguanRead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      mediaStreamTrack: '',
      feat: '',
      vedio: false,
      imgFlag: true,
      shot: false,
      deviceId: '',
      devices: [],
      fetching: false,
      originFeat: ''
    };
    this.openVideo = this.openVideo.bind(this);
    this.getFeat = this.getFeat.bind(this);
    this.staffCode = getQueryString('staffCode', this.props.location.search);
    this.ruzhi = getQueryString('ruzhi', this.props.location.search);
    this.idNo = getQueryString('idNo', this.props.location.search);
  }
  componentDidMount() {
    // 获取媒体方法（旧方法）
    navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMeddia || navigator.msGetUserMedia;
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');
    this.video = document.getElementById('video');
    this.mediaStreamTrack = '';
    this.setState({ fetching: true });
    queryStaffDetail(this.staffCode).then((res) => {
      this.setState({
        fetching: false,
        pict1: res.pict1 || res.pic1,
        originFeat: res.feat
      });
    }).catch(() => { this.setState({ fetching: false }); });
    this.getdeviceId();
  };
  next() {
    this.props.history.push(`/staff/jiandang/idInfoRead`);
  };
  getdeviceId = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.enumerateDevices()
          .then((devices) => {
            this.deviceArr = [];
            let tmpArr = devices.filter(device => device.kind === 'videoinput');
            this.setState({
              devices: tmpArr,
              deviceId: tmpArr.length ? tmpArr[0].deviceId : ''
            });
            if (tmpArr.length) {
              this.openVideo(tmpArr[0].deviceId);
            } else {
              showWarnMsg('未发现摄像头');
            }
          }).catch(function(err) {
        console.log(err.name + ': ' + err.message);
      });
    }
  }
  // 打开摄像头
  openVideo(deviceId) {
    // 使用新方法打开摄像头
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: { deviceId },
        audio: true
      }).then((stream) => {
        this.mediaStreamTrack = typeof (stream.stop) === 'function' ? stream : stream.getTracks()[1];
        if (this.video.srcObject) {
          this.video.srcObject = stream;
        } else {
          this.video.src = (window.URL || window.webkitURL).createObjectURL(stream);
        }
        setTimeout(() => {
          this.video.play();
        }, 300);
      }).catch(function(err) {
        console.log(err);
      });
    } else if (navigator.getMedia) { // 使用旧方法打开摄像头
      navigator.getMedia({
        video: true
      }, (stream) => {
        this.mediaStreamTrack = stream.getTracks()[0];
        if (this.video.srcObject) {
          this.video.srcObject = stream;
        } else {
          this.video.src = (window.URL || window.webkitURL).createObjectURL(stream);
        }
        setTimeout(() => {
          this.video.play();
        }, 300);
      }, function(err) {
        console.log(err);
      });
    }
  };
  // 截取图像
  cutImg = () => {
    this.setState({
      vedio: false,
      imgFlag: false,
      shot: false
    });
    this.context = this.canvas.getContext('2d');
    this.canvas.width = 338 * 3;
    this.canvas.height = 408 * 3;
    let scaleH = this.video.videoHeight / 408;
    let scaleW = this.video.videoWidth / 338;
    if (scaleH > scaleW) {
      let sy = (this.video.videoHeight - 408 * scaleW) / 2;
      this.context.drawImage(this.video, 0, sy, this.video.videoWidth, 408 * scaleW, 0, 0, 338 * 3, 408 * 3);
    } else {
      let sx = (this.video.videoWidth - scaleH * 338) / 2;
      this.context.drawImage(this.video, sx, 0, scaleH * 338, this.video.videoHeight, 0, 0, 338 * 3, 408 * 3);
    }
  };
  getPixelRatio() {
    var backingStore = this.context.backingStorePixelRatio ||
        this.context.webkitBackingStorePixelRatio ||
        this.context.mozBackingStorePixelRatio ||
        this.context.msBackingStorePixelRatio ||
        this.context.oBackingStorePixelRatio ||
        this.context.backingStorePixelRatio || 1;
    return (window.devicePixelRatio || 1) / backingStore;
  };
  getFeat() {
    let base64 = this.canvas.toDataURL('image/jpeg');
    axios.post('https://feat.aijmu.com/getfeature', base64, {
      withCredentials: false
    }).then((rs) => {
      let result = /getFaceFeature\({"data":"([^]+)"}\)/.exec(rs.data);
      if (!result || result[1] === 'error' || result[1] === 'NOFACE') {
        showWarnMsg('请对准人脸');
        this.setState({ feat: '' });
        return;
      }
      this.setState({
        feat: result[1]
      });
    }).catch(() => { showWarnMsg('网络异常'); });
  }
  handleShotClick = () => {
    this.state.shot === true ? this.shot() : this.cancel();
  };
  shot() {
    this.cutImg();
    this.getFeat();
  }
  cancel() {
    this.setState({
      vedio: true,
      shot: true
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    let info = {};
    info.feat1 = this.state.originFeat;
    info.feat2 = this.state.feat;
    let param = JSON.stringify(info);
    axios.post('https://feat.aijmu.com/comparefeature', param).then((rs) => {
      let result = /getSim\({"data":"([^]+)"}\)/.exec(rs.data);
      if (!result || result[1] === '-100') {
        showWarnMsg('请重新拍照');
      } else {
        if(+result[1] >= 70) {
          showSucMsg('验证特征值成功');
        } else {
          showWarnMsg('验证特征值失败');
        }
      }
    }).catch((e) => { showWarnMsg('网络异常'); console.log(e); });
  };
  deviceChange = (v) => {
    this.setState({deviceId: v});
    if (v) {
      this.cancel();
      this.openVideo(v);
    }
  };
  render() {
    return (
        <Spin spinning={this.state.fetching}>
          <div>
            <div className="checkFeat-title"><i></i><span>人脸采集</span></div>
            <div>
              <label>摄像头</label>
              <Select style={{
                marginTop: 20,
                marginLeft: 20,
                width: 300
              }} onChange={this.deviceChange}
                      value={this.state.deviceId}>
                {this.state.devices.map(v => <Option value={v.deviceId}>{v.label}</Option>)}
              </Select>
            </div>
            <div className="checkFeat-twoBox">
              <div className="checkFeat-originPic">
                <img src={this.state.pict1} className="haveUserImg" alt=""/>
              </div>
              <div className="checkFeat-video-box" style={{ display: this.state.vedio ? 'inline-block' : 'none' }} onClick={ this.handleShotClick }>
                <div className="figure"><img src={Figure} alt=""/></div>
                <video id="video" className="video3"></video>
              </div>
              <div className="checkFeat-img-box" style={{ display: this.state.vedio ? 'none' : 'inline-block' }} onClick={ this.handleShotClick }>
                <div className="border">
                  <span></span><span></span><span></span><span></span>
                  <img src={Photo} className="userImg3" id="userImg" style={{ display: this.state.imgFlag ? 'inline-block' : 'none' }}/>
                </div>
                <div className="tips">
                  <span>点击拍摄</span>
                  <span>请保持正脸在线框之内</span>
                </div>
                <canvas id="canvas" className="inner-item" style={{ width: '340px', height: '410px' }} width="1020" height="1230"></canvas>
              </div>
            </div>
            <div style={{ paddingTop: 20 }}>
              <div className="checkFeat-btns" style={{ textAlign: 'center' }}>
                <div>
                  <button className="ant-btn ant-btn-primary " onClick={ this.handleSubmit }>确定</button>
                </div>
              </div>
            </div>
          </div>
        </Spin>
    );
  }
}

export default mianguanRead;