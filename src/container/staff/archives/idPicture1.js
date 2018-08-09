import React from 'react';
import axios from 'axios';
import { Button } from 'antd';
import './idPicture.css';
import Figure from './figure.png';
import Hold from './hold.png';
import IDFRONT from './id-front.png';
import IDBACK from './id-back.png';
import { getQueryString, getUserId } from 'common/js/util';
import { idPicture3, getStaffDetail } from 'api/user';
import { showSucMsg } from '../../../common/js/util';

class mianguanRead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        'text': '',
        'mediaStreamTrack': '',
        'feat': '',
        'video1': false,
        'video2': false,
        'video3': false,
        'shot': true,
        'pic1': '',
        'pic2': '',
        'pic3': '',
        'next': false
    };
    // this.openVideo = this.openVideo.bind(this);
    this.cutImg = this.cutImg.bind(this);
    this.shot = this.shot.bind(this);
    this.handleShotClick = this.handleShotClick.bind(this);
    this.next = this.next.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.code = getQueryString('code', this.props.location.search);
    this.idNo = getQueryString('idNo', this.props.location.search);
    this.ruzhi = getQueryString('ruzhi', this.props.location.search);
  }
  componentDidMount() {
  // 获取媒体方法（旧方法）
      navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMeddia || navigator.msGetUserMedia;
      this.context = this.canvas1.getContext('2d');
      this.mediaStreamTrack = '';
      getStaffDetail(this.idNo).then((res) => {
        this.setState({
          pic1: res.pic2 || res.pict2,
          pic2: res.pic3 || res.pict3,
          pic3: res.pic4 || res.pict4
        });
        if(res.contacts) {
          this.setState({
            next: true
          });
        } else {
          this.code = res.code;
        }
      });
  };
  next() {
    this.props.history.push(`/staff/jiandang/idInfoRead`);
  };
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
    // this.context = currentCanvas.getContext('2d');
    if(index === '1' || index === '2') {
      // this.context.drawImage(currentVideo, 0, 0, 1020, 720);
      this.context = currentCanvas.getContext('2d');
      currentCanvas.width = 338 * 3;
      currentCanvas.height = 238 * 3;
      let scaleH = currentVideo.videoHeight / 238;
      let scaleW = currentVideo.videoWidth / 338;
      if (scaleH > scaleW) {
        let sy = (currentVideo.videoHeight - 238 * scaleW) / 2;
        this.context.drawImage(currentVideo, 0, sy, currentVideo.videoWidth, 238 * scaleW, 0, 0, 338 * 3, 238 * 3);
      } else {
        let sx = (currentVideo.videoWidth - scaleH * 338) / 2;
        this.context.drawImage(currentVideo, sx, 0, scaleH * 338, currentVideo.videoHeight, 0, 0, 338 * 3, 238 * 3);
      }
    } else {
      // this.context.drawImage(currentVideo, 0, 0, 1020, 1536);
      this.context = currentCanvas.getContext('2d');
      currentCanvas.width = 340 * 3;
      currentCanvas.height = 512 * 3;
      let scaleH = currentVideo.videoHeight / 512;
      let scaleW = currentVideo.videoWidth / 340;
      if (scaleH > scaleW) {
        let sy = (currentVideo.videoHeight - 512 * scaleW) / 2;
        this.context.drawImage(currentVideo, 0, sy, currentVideo.videoWidth, 512 * scaleW, 0, 0, 340 * 3, 512 * 3);
      } else {
        let sx = (currentVideo.videoWidth - scaleH * 340) / 2;
        this.context.drawImage(currentVideo, sx, 0, scaleH * 340, currentVideo.videoHeight, 0, 0, 340 * 3, 512 * 3);
      }
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
    if(this.state.next) {
      this.props.history.push(`/staff/jiandang/luru1?ruzhi=${this.ruzhi}&idNo=${this.idNo}`);
      return;
    }
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
            this.props.history.push(`/staff/jiandang/luru?ruzhi=${this.ruzhi}&code=${this.code}&idNo=${this.idNo}`);
        }
    });
    console.log(this.state);
};

  render() {
    return (
        <div className="id-total">
          <div className="title"><i></i><span>证件采集</span></div>
          <div className="out">
            <div className="left">
              <div className="top">
                <div className="id-video-box" style={{ display: this.state.video1 ? 'block' : 'none' }}>
                  <div className="border">
                    <span></span><span></span><span></span><span></span>
                  </div>
                  <video ref={video => this.video1 = video} className="id-video"></video>
                </div>
                <div className="id-img-box" style={{ display: this.state.video1 ? 'none' : 'block' }}>
                  <img src={this.state.pic1} className="haveUserImg1" id="userImg" style={{ display: !this.state.pic3 ? 'none' : 'inline-block' }}/>
                  <canvas ref={canvas => this.canvas1 = canvas} className="inner-item" style={{ width: '340px', height: '240px' }} width="1020" height="720"></canvas>
                </div>
              </div>
              <div className="bottom">
                <div className="id-video-box" style={{ display: this.state.video2 ? 'block' : 'none' }}>
                  <div className="border">
                    <span></span><span></span><span></span><span></span>
                  </div>
                  <video ref={video => this.video2 = video} className="id-video"></video>
                </div>
                <div className="id-img-box" style={{ display: this.state.video2 ? 'none' : 'block' }}>
                  <img src={this.state.pic2} className="haveUserImg1" id="userImg" style={{ display: !this.state.pic3 ? 'none' : 'inline-block' }}/>
                  <canvas ref={canvas => this.canvas2 = canvas} className="inner-item" style={{ width: '340px', height: '240px' }} width="1020" height="720"></canvas>
                </div>
              </div>
            </div>
            <div className="right">
              <div className="id-video-box" style={{ display: this.state.video3 ? 'block' : 'none' }}>
                <div className="figure"><img src={Figure} alt=""/></div>
                <video ref={video => this.video3 = video} className="id-video"></video>
              </div>
              <div className="id-img-box" style={{ display: this.state.video3 ? 'none' : 'block' }}>
                <img src={this.state.pic3} className="haveUserImg1" id="userImg" style={{ display: !this.state.pic3 ? 'none' : 'inline-block' }}/>
                <canvas ref={canvas => this.canvas3 = canvas} className="inner-item" style={{ width: '340px', height: '512px' }} width="1020" height="1536"></canvas>
              </div>
            </div>
            <div className="button">
              <Button type="primary" style={{ width: 340, height: 46 }} id="cut" onClick={ this.handleSubmit }>下一步</Button>
            </div>
          </div>
        </div>
    );
  }
}

export default mianguanRead;