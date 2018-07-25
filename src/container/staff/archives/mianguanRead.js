import React from 'react';
import { Base64 } from 'js-base64';
import axios from 'axios';
import originJsonp from 'jsonp';
import './mianguanRead.css';
import Photo from './touxiang.png';
import { getQueryString, getUserId, showWarnMsg, showSucMsg } from 'common/js/util';
import { mianguanPicture, getFeatInfo } from 'api/user';
// import { resolve } from 'dns';

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
        'text': '',
        'mediaStreamTrack': '',
        'feat': '',
        'vedio': true,
        'imgFlag': true,
        'shot': true
    };
    this.openVideo = this.openVideo.bind(this);
    this.cutImg = this.cutImg.bind(this);
    this.getFeat = this.getFeat.bind(this);
    this.handleShotClick = this.handleShotClick.bind(this);
    this.next = this.next.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.code = getQueryString('code', this.props.location.search);
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
      this.openVideo();
  };
  next() {
    this.props.history.push(`/staff/jiandang/idInfoRead`);
  };
  // 打开摄像头
  openVideo(argument) {
    // 使用新方法打开摄像头
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: true,
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
  cutImg() {
    this.setState({
        vedio: false,
        imgFlag: false,
        shot: false
    });
    this.context = this.canvas.getContext('2d');
    // this.context.scale(0.5, 0.5);
    this.context.drawImage(this.video, 0, 0, 1024, 768);
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
      // getFeatInfo(base64).then((res) => {
      //   var result = /getFaceFeature\({"data":"([^]+)"}\)/.exec(res);
      //   if (!result || result[1] === 'error' || result[1] === 'NOFACE') {
      //       showWarnMsg('请对准人脸');
      //       return;
      //   };
      //   this.setState({
      //       feat: result[1]
      //   });
      // });
      // jsonp('http://118.31.17.181/getfeature', Base64.encode(base64))
    // console.log(base64);
    // axios.post('https://feat.aijmu.com/getfeature', encodeURIComponent(base64), {
    axios.post('https://feat.aijmu.com/getfeature', base64, {
        withCredentials: false
    }).then((rs) => {
      // console.log(rs);
      // console.log(rs.data);
      var result = /getFaceFeature\({"data":"([^]+)"}\)/.exec(rs.data);
            if (!result || result[1] === 'error' || result[1] === 'NOFACE') {
                showWarnMsg('请对准人脸');
                this.setState({ feat: '' });
                return;
            };
            this.setState({
                feat: result[1]
            });
        });
  }
  handleShotClick() {
    this.state.shot === true ? this.shot() : this.cancel();
  }
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
  handleSubmit(e) {
    e.preventDefault();
    var info = {};
    // if (this.state.feat) {
        info.feat = this.state.feat;
    //     info.feat = 'NOFACE';
        info.pic1 = this.canvas.toDataURL('image/jpeg');
        this.upload(info);
    // } else if (!this.state.feat) {
    //     showWarnMsg('请重新拍摄');
    // };
};
upload(info) {
    info.code = this.code;
    info.updater = getUserId();
    if(info.feat) {
      mianguanPicture(info).then(rs => {
        if (rs.isSuccess) {
          showSucMsg('提交成功');
          this.props.history.push(`/staff/jiandang/idPicture?ruzhi=${this.ruzhi}&code=${this.code}&idNo=${this.idNo}`);
        } else {
          showWarnMsg(rs.errorInfo || '提交失败');
        }
      });
    } else {
      showWarnMsg('请拍摄免冠照');
    }
};

  render() {
    return (
      <div className="SectionContainer3" style={{ border: '2px solid #096dd9' }}>
        <div className="section3">
            <div style={{ verticalAlign: 'middle', width: '100%' }}>
                <div className="comparison-main3 comparison-mains3">
                <div className="head-wrap3"><i></i>免冠照读取</div>
                    <div className="clearfix3">
                        <div className="inner-box3">
                            <div className="img-wrap3 left-img video-box" style={{ display: this.state.vedio ? 'block' : 'none', margin: '0 auto' }}>
                                <div className="border"></div>
                                <video id="video" className="video3"></video>
                            </div>
                            <div className="img-wrap3 right-img3 img-box" style={{ border: '1px solid #4c98de', display: this.state.vedio ? 'none' : 'block', margin: '0 auto' }}>
                                <div className="border"></div>
                                <img src={Photo} className="userImg3" id="userImg" style={{ display: this.state.imgFlag ? 'block' : 'none' }}/>
                                <canvas id="canvas" className="inner-item" style={{ width: '512px', height: '384px' }} width="1024" height="768"></canvas>
                            </div>
                            <div style={{ paddingTop: 20 }}>
                                <div className="btn-item3" style={{ textAlign: 'center' }}>
                                <div>
                                <button
                                    className="ant-btn ant-btn-primary ant-btn-lg"
                                    style={{ width: 285, marginBottom: 20, backgroundColor: '#4c98de', color: '#fff' }}
                                    id="cut"
                                    onClick={ this.handleShotClick }>{this.state.shot ? '拍摄' : '取消'}</button>
                                </div>
                                <div>
                                    <button className="ant-btn ant-btn-primary ant-btn-lg" style={{ width: 250 }} id="cut" onClick={ this.handleSubmit }>下一步</button>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }
}

export default mianguanRead;