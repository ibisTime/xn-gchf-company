import React from 'react';
import axios from 'axios';
import { Button, Select } from 'antd';
import './idPicture.css';
import idPic1 from './idzhengmian.png';
import idPic2 from './idfanmian.png';
import idPic3 from './shouchizhengjian.png';
import { getQueryString, getUserId, showWarnMsg } from 'common/js/util';
import { idPicture3, getStaffDetail } from 'api/user';
import { showSucMsg } from '../../../common/js/util';

const {Option} = Select;

class mianguanRead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      mediaStreamTrack: '',
      feat: '',
      video1: false,
      video2: false,
      video3: false,
      shot: true,
      pic1: '',
      pic2: '',
      pic3: '',
      deviceId: '',
      devices: []
    };
    // this.openVideo = this.openVideo.bind(this);
    this.cutImg = this.cutImg.bind(this);
    this.shot = this.shot.bind(this);
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
      this.context = this.canvas1.getContext('2d');
      this.mediaStreamTrack = '';
      getStaffDetail(this.idNo).then((res) => {
        if(res.pict1) {
          this.setState({
            pic1: res.pict2,
            pic2: res.pict3,
            pic3: res.pict4
          });
        }
        if(res.contacts) {
          this.setState({
            next: true
          });
        }
      });
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
            if (!tmpArr.length) {
              showWarnMsg('未发现摄像头');
            }
          }).catch(function(err) {
        console.log(err.name + ': ' + err.message);
      });
    }
  }
  // 打开摄像头
  openVideo1() {
    console.log(this.state);
    // 使用新方法打开摄像头
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then((stream) => {
            this.mediaStreamTrack = typeof (stream.stop) === 'function' ? stream : stream.getTracks()[1];
            if (this.video1.srcObject) {
                this.video1.srcObject = stream;
            } else {
                this.video1.src = (window.URL || window.webkitURL).createObjectURL(stream);
            }
            setTimeout(() => {
                this.video1.play();
            }, 300);
        }).catch(function(err) {
            console.log(err);
        });
    } else if (navigator.getMedia) { // 使用旧方法打开摄像头
        navigator.getMedia({
            video: true
        }, (stream) => {
            this.mediaStreamTrack = stream.getTracks()[0];
            if (this.video1.srcObject) {
                this.video1.srcObject = stream;
            } else {
                this.video1.src = (window.URL || window.webkitURL).createObjectURL(stream);
            }
            setTimeout(() => {
                this.video1.play();
            }, 300);
        }, function(err) {
            console.log(err);
        });
    }
  };
  openVideo2() {
    // 使用新方法打开摄像头
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then((stream) => {
            this.mediaStreamTrack = typeof (stream.stop) === 'function' ? stream : stream.getTracks()[1];
            if (this.video2.srcObject) {
                this.video2.srcObject = stream;
            } else {
                this.video2.src = (window.URL || window.webkitURL).createObjectURL(stream);
            }
            setTimeout(() => {
                this.video2.play();
            }, 300);
        }).catch(function(err) {
            console.log(err);
        });
    } else if (navigator.getMedia) { // 使用旧方法打开摄像头
        navigator.getMedia({
            video: true
        }, (stream) => {
            this.mediaStreamTrack = stream.getTracks()[0];
            if (this.video2.srcObject) {
                this.video2.srcObject = stream;
            } else {
                this.video2.src = (window.URL || window.webkitURL).createObjectURL(stream);
            }
            setTimeout(() => {
                this.video2.play();
            }, 300);
        }, function(err) {
            console.log(err);
        });
    }
  };
  openVideo3() {
    // 使用新方法打开摄像头
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then((stream) => {
            this.mediaStreamTrack = typeof (stream.stop) === 'function' ? stream : stream.getTracks()[1];
            if (this.video3.srcObject) {
                this.video3.srcObject = stream;
            } else {
                this.video3.src = (window.URL || window.webkitURL).createObjectURL(stream);
            }
            setTimeout(() => {
                this.video3.play();
            }, 300);
        }).catch(function(err) {
            console.log(err);
        });
    } else if (navigator.getMedia) { // 使用旧方法打开摄像头
        navigator.getMedia({
            video: true
        }, (stream) => {
            this.mediaStreamTrack = stream.getTracks()[0];
            if (this.video3.srcObject) {
                this.video3.srcObject = stream;
            } else {
                this.video3.src = (window.URL || window.webkitURL).createObjectURL(stream);
            }
            setTimeout(() => {
                this.video3.play();
            }, 300);
        }, function(err) {
            console.log(err);
        });
    }
  };
  // 截取图像
  cutImg(index) {
    this.setState({
        video1: false,
        video2: false,
        video3: false
    });
    let currentCanvas = this[`canvas${index}`];
    let currentVideo = this[`video${index}`];
    this.context = currentCanvas.getContext('2d');
    this.context.drawImage(currentVideo, 0, 0, 260, 213);
    this.getBase64(currentCanvas, index);
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
  getBase64(canvas, index) {
    let base64 = canvas.toDataURL('image/jpeg');
    // this.uploadByBase64(base64).then((res) => {
    //     console.log(res);
    // });
    console.log(base64, index);
    this.setState({ [`pic${index}`]: base64 });
  }
//   uploadByBase64(base64) {
//     base64 = base64.substr(base64.indexOf('base64,') + 7);
//     https://up-z2.qbox.me
//     return request.post('http://up-z2.qiniu.com/putb64/-1/key/' + key)
//       .set('Content-Type', 'application/octet-stream')
//       .set('Authorization', `UpToken ${this.token}`)
//       .send(base64)
//       .promise();
//   }
  handleShotClick() {
      let currentVideo = this.state.video1 ? '1' : this.state.video2 ? '2' : '3';
      this.cutImg(currentVideo);
  }
  shot(index) {
    console.log(index);
    if(index === 1) {
        this.setState({
            video1: true,
            video2: false,
            video3: false
        });
        this.openVideo1();
    } else if(index === 2) {
        this.setState({
            video1: false,
            video2: true,
            video3: false
        });
        this.openVideo2();
    } else {
        this.setState({
            video1: false,
            video2: false,
            video3: true
        });
        this.openVideo3();
    }
  }
  cancel() {
    this.setState({
        vedio: true,
        shot: true
    });
  };
  handleSubmit(e) {
    e.preventDefault();
    var info = {
        pic1: this.state.pic1,
        pic2: this.state.pic2,
        pic3: this.state.pic3,
        updater: getUserId(),
        code: this.code
    };
    idPicture3(info).then((res) => {
        if(res.isSuccess) {
            showSucMsg('提交成功');
            this.props.history.push(`/staff/jiandang/luru2?ruzhi=${this.ruzhi}&code=${this.code}&idNo=${this.idNo}`);
        }
    });
    console.log(this.state);
};
  deviceChange = (v) => {
    this.setState({deviceId: v});
    if (v) {
      this.shot(this.curIdx, v);
    }
  }
  render() {
    return (
      <div className="SectionContainer1" style={{ border: '2px solid #096dd9' }}>
        <div className="section1">
            <div style={{ verticalAlign: 'middle', width: '100%' }}>
                <div className="comparison-main1 comparison-mains1">
                <div className="head-wrap1"><i></i>证件照读取</div>
                    <div className="clearfix1">
                        <div className="inner-box1">
                          <div className="title">
                            <span>身份证正面照</span>
                            <span>身份证反面照</span>
                            <span>手持身份证照</span>
                          </div>
                          <div className="img-wrap1 left-img" style={{ display: this.state.video1 ? 'inline-block' : 'none', margin: '0 58px 0 70px' }}>
                                <video ref={video => this.video1 = video} className="video1"></video>
                            </div>
                            <div
                                className="img-wrap1 right-img1"
                                style={{ border: '1px solid #4c98de', display: this.state.video1 ? 'none' : 'inline-block', margin: '0 58px 0 70px' }}
                                onClick={ () => { this.shot(1); } }
                            >
                                <img src={this.state.pic1} className="haveUserImg1" id="userImg" style={{ display: !this.state.pic1 ? 'none' : 'inline-block' }}/>
                                <canvas ref={canvas => this.canvas1 = canvas} className="inner-item" width="260" height="213"></canvas>
                            </div>
                            <div className="img-wrap1 left-img" style={{ display: this.state.video2 ? 'inline-block' : 'none', margin: '0 58px 0 0' }}>
                                <video ref={video => this.video2 = video} className="video1"></video>
                            </div>
                            <div
                                className="img-wrap1 right-img1"
                                style={{ border: '1px solid #4c98de', display: this.state.video2 ? 'none' : 'inline-block', margin: '0 58px 0 0' }}
                                onClick={ () => { this.shot(2); } }
                            >
                                <img src={this.state.pic2} className="haveUserImg1" id="userImg" style={{ display: !this.state.pic2 ? 'none' : 'inline-block' }}/>
                                <canvas ref={canvas => this.canvas2 = canvas} className="inner-item" width="260" height="213"></canvas>
                            </div>
                            <div className="img-wrap1 left-img" style={{ display: this.state.video3 ? 'inline-block' : 'none', margin: '0 58px 0 0' }}>
                                <video ref={video => this.video3 = video} className="video1"></video>
                            </div>
                            <div
                                className="img-wrap1 right-img1"
                                style={{ border: '1px solid #4c98de', display: this.state.video3 ? 'none' : 'inline-block', margin: '0 0 0 0' }}
                                onClick={ () => { this.shot(3); } }
                            >
                                <img src={this.state.pic3} className="haveUserImg1" id="userImg" style={{ display: !this.state.pic3 ? 'none' : 'inline-block' }}/>
                                <canvas ref={canvas => this.canvas3 = canvas} className="inner-item" width="260" height="213"></canvas>
                            </div>
                            <div style={{ paddingTop: 20 }}>
                                <div className="btn-item" style={{ textAlign: 'center' }}>
                                <div>
                                <Button
                                    style={{ width: 285, marginBottom: 20, backgroundColor: '#4c98de', color: '#fff' }}
                                    id="cut"
                                    // onClick={ () => { this.handleShotClick(1); } }>{this.state.shot ? '拍摄' : '取消'}</button>
                                    onClick={ this.handleShotClick }>拍摄</Button>
                                </div>
                                <div>
                                <Button style={{ width: 250 }} id="cut" onClick={ this.handleSubmit }>下一步</Button>
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