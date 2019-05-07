import React from 'react';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/staff/jiandang-step2';
import { getQueryString, getUserId } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { UPLOAD_URL } from 'common/js/config';
import { getQiniuToken } from 'api/general';
import axios from 'axios';
import { Modal, Button, message } from 'antd';

let eleObj = {
  spEle01: null,
  spEle02: null,
  spEle03: null
};
@DetailWrapper(
  state => state.jiandangStep2,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class JiandangStep2 extends React.Component {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
    this.ctxShow = null;
    this.time = null;
    this.isIndex = 0;
    this.mediaStreamTrack = null;
  }
  state = {
    visible: false,
    updateUrl01: '',
    updateUrl02: '',
    updateUrl03: '',
    updateUrl04: '',
    isDelete01: false,
    isDelete02: false,
    isDelete03: false,
    isDelete04: false,
    upUrl01: '',
    upUrl02: '',
    upUrl03: '',
    upUrl04: '',
    setIndex: 0
  };
  spanElement = (index) => {
    const doc = document;
    if(index || index === 0) {
      const pictureCard = doc.querySelectorAll('.ant-upload-select-picture-card')[index];
      const cardSpan = doc.querySelectorAll('.ant-upload-select-picture-card>span')[index];
      setTimeout(() => {
        pictureCard.style.display = 'inline-block';
        pictureCard.style.lineHeight = '104px';
        cardSpan.style.display = 'inline-block';
        cardSpan.style.verticalAlign = 'baseline';
      }, 300);
    }else {
      const pictureCardAll = doc.querySelectorAll('.ant-upload-select-picture-card');
      const cardAllSpan = doc.querySelectorAll('.ant-upload-select-picture-card>span');
      pictureCardAll.forEach(item => {
        item.style.display = 'inline-block';
        item.style.lineHeight = '104px';
      });
      cardAllSpan.forEach(item => {
        item.style.display = 'inline-block';
        item.style.verticalAlign = 'baseline';
      });
    }
  };
  getElement = () => {
    const doc = document;
    const ele01 = doc.querySelectorAll('.ant-form-item-control')[0];
    const ele02 = doc.querySelectorAll('.ant-form-item-control')[1];
    const ele03 = doc.querySelectorAll('.ant-form-item-control')[2];
    const ele04 = doc.querySelectorAll('.ant-form-item-control')[3];
    eleObj.spEle01 = doc.createElement('div');
    eleObj.spEle02 = doc.createElement('div');
    eleObj.spEle03 = doc.createElement('div');
    eleObj.spEle04 = doc.createElement('div');
    ele01.style.marginBottom = '20px';
    ele02.style.marginBottom = '20px';
    ele03.style.marginBottom = '20px';
    ele04.style.marginBottom = '20px';
    eleObj.spEle01.style.margin = '0px 30px 20px';
    eleObj.spEle01.style.display = 'inline-block';
    eleObj.spEle02.style.margin = '0px 30px 20px';
    eleObj.spEle02.style.display = 'inline-block';
    eleObj.spEle03.style.margin = '0px 30px 20px';
    eleObj.spEle03.style.display = 'inline-block';
    eleObj.spEle04.style.margin = '0px 30px 20px';
    eleObj.spEle04.style.display = 'inline-block';
    eleObj.spEle01.innerText = '或';
    eleObj.spEle02.innerText = '或';
    eleObj.spEle03.innerText = '或';
    eleObj.spEle04.innerText = '或';
    ele01.appendChild(eleObj.spEle01);
    ele02.appendChild(eleObj.spEle02);
    ele03.appendChild(eleObj.spEle03);
    ele04.appendChild(eleObj.spEle04);
    this.appendEle01 = doc.createElement('div');
    this.appendEle02 = doc.createElement('div');
    this.appendEle03 = doc.createElement('div');
    this.appendEle04 = doc.createElement('div');
    this.appendEle01.classList.add('photo_ele');
    this.appendEle01.innerText = '拍照上传';
    ele01.addEventListener('click', (ev) => {
      if(ev.target.getAttribute('data-icon') === 'delete') {
        eleObj.spEle01.style.display = 'inline-block';
        this.setState({
          updateUrl01: '',
          isDelete01: true
        }, () => {
          this.spanElement(0);
        });
      }
      if(ev.target.tagName.toLowerCase() === 'input') {
        eleObj.spEle01.style.display = 'inline-block';
        this.appendEle01.style.backgroundImage = '';
        this.appendEle01.innerText = '拍照上传';
        this.setState({
          updateUrl01: ''
        });
      }
    });
    ele02.addEventListener('click', (ev) => {
      if(ev.target.getAttribute('data-icon') === 'delete') {
        eleObj.spEle02.style.display = 'inline-block';
        this.setState({
          updateUrl02: '',
          isDelete02: true
        }, () => {
          this.spanElement(1);
        });
      }
      if(ev.target.tagName.toLowerCase() === 'input') {
        eleObj.spEle02.style.display = 'inline-block';
        this.appendEle02.style.backgroundImage = '';
        this.appendEle02.innerText = '拍照上传';
        this.setState({
          updateUrl02: ''
        });
      }
    });
    ele03.addEventListener('click', (ev) => {
      if(ev.target.getAttribute('data-icon') === 'delete') {
        eleObj.spEle03.style.display = 'inline-block';
        this.setState({
          updateUrl03: '',
          isDelete03: true
        }, () => {
          this.spanElement(2);
        });
      }
      if(ev.target.tagName.toLowerCase() === 'input') {
        eleObj.spEle03.style.display = 'inline-block';
        this.appendEle03.style.backgroundImage = '';
        this.appendEle03.innerText = '拍照上传';
        this.setState({
          updateUrl03: ''
        });
      }
    });
    ele04.addEventListener('click', (ev) => {
      if(ev.target.getAttribute('data-icon') === 'delete') {
        eleObj.spEle04.style.display = 'inline-block';
        this.setState({
          updateUrl04: '',
          isDelete04: true
        }, () => {
          this.spanElement(3);
        });
      }
      if(ev.target.tagName.toLowerCase() === 'input') {
        eleObj.spEle04.style.display = 'inline-block';
        this.appendEle04.style.backgroundImage = '';
        this.appendEle04.innerText = '拍照上传';
        this.setState({
          updateUrl04: ''
        });
      }
    });
    this.appendEle01.addEventListener('click', () => {
      this.showModal();
      this.setState({
        setIndex: 0,
        isDelete01: false
      }, () => {
        const antion = doc.querySelectorAll('.ant-upload-list-picture-card')[0].children[0];
        if(antion) {
          antion.children[1].children[1].click();
        }
        setTimeout(() => {
          this.spanElement(0);
        }, 500);
      });
    });
    this.appendEle02.classList.add('photo_ele');
    this.appendEle02.innerText = '拍照上传';
    this.appendEle02.addEventListener('click', () => {
      this.showModal();
      this.setState({
        setIndex: 1,
        isDelete02: false
      }, () => {
        const antion = doc.querySelectorAll('.ant-upload-list-picture-card')[1].children[0];
        if(antion) {
          antion.children[1].children[1].click();
        }
        setTimeout(() => {
          this.spanElement(1);
        }, 500);
      });
    });
    this.appendEle03.classList.add('photo_ele');
    this.appendEle03.innerText = '拍照上传';
    this.appendEle03.addEventListener('click', () => {
      this.showModal();
      this.setState({
        setIndex: 2,
        isDelete03: false
      }, () => {
        const antion = doc.querySelectorAll('.ant-upload-list-picture-card')[2].children[0];
        if(antion) {
          antion.children[1].children[1].click();
        }
        setTimeout(() => {
          this.spanElement(2);
        }, 500);
      });
    });
    this.appendEle04.classList.add('photo_ele');
    this.appendEle04.innerText = '拍照上传';
    this.appendEle04.addEventListener('click', () => {
      this.showModal();
      this.setState({
        setIndex: 3,
        isDelete04: false
      }, () => {
        const antion = doc.querySelectorAll('.ant-upload-list-picture-card')[3].children[0];
        if(antion) {
          antion.children[1].children[1].click();
        }
        setTimeout(() => {
          this.spanElement(3);
        }, 500);
      });
    });
    ele01.appendChild(this.appendEle01);
    ele02.appendChild(this.appendEle02);
    ele03.appendChild(this.appendEle03);
    ele04.appendChild(this.appendEle04);
  };
  getMedia = () => {
    let constraints = {
      video: {width: 500, height: 500},
      audio: true
    };
    // 获得video摄像头区域
    let video = document.getElementById('video');
    // then()方法是异步执行，当then()前的方法执行完后再执行then()内部的程序
    // 避免数据没有获取到
    let promise = navigator.mediaDevices.getUserMedia(constraints);
    promise.then((MediaStream) => {
      this.mediaStreamTrack = MediaStream;
      video.srcObject = MediaStream;
      video.play();
    });
  };
  putb64 = (basePic, index) => {
    getQiniuToken().then((data) => {
      let pic = basePic.replace(/^.*?base64,/, '');
      axios({
        method: 'post',
        url: UPLOAD_URL + '/putb64/-1',
        data: pic,
        headers: {
          'Content-Type': 'application/octet-stream',
          'Authorization': 'UpToken ' + data.uploadToken
        }
      }).then(upData => {
        const upUrl = upData.data.hash;
        switch(index) {
          case 0:
            this.setState({
              upUrl01: upUrl
            });
            break;
          case 1:
            this.setState({
              upUrl02: upUrl
            });
            break;
          case 2:
            this.setState({
              upUrl03: upUrl
            });
            break;
          case 3:
            this.setState({
              upUrl04: upUrl
            });
            break;
        }
      });
    }).catch(() => this.setState({ fetching: false }));
  };
  takePhoto = () => {
    const doc = document;
    // 获得Canvas对象
    let video = doc.getElementById('video');
    let canvasShow = doc.getElementById('canvasShow');
    this.ctxShow = canvasShow.getContext('2d');
    this.ctxShow.drawImage(video, 0, 0, 300, 300);
    const dataUrl = canvasShow.toDataURL();
    this.putb64(dataUrl, this.state.setIndex);
    switch(this.state.setIndex) {
      case 0:
        this.setState({
          updateUrl01: dataUrl
        });
        break;
      case 1:
        this.setState({
          updateUrl02: dataUrl
        });
        break;
      case 2:
        this.setState({
          updateUrl03: dataUrl
        });
        break;
      case 3:
        this.setState({
          updateUrl04: dataUrl
        });
        break;
    }
  };
  showModal = () => {
    this.setState({
      visible: true
    });
    this.getMedia();
  };
  handleOk = () => {
    if(!this.state[`updateUrl0${this.state.setIndex + 1}`]) {
      message.warning('请选择拍照后操作', 1.5);
      return;
    }
    this.setState({ visible: false });
    this[`appendEle0${this.state.setIndex + 1}`].innerText = '';
    this[`appendEle0${this.state.setIndex + 1}`].style.backgroundImage = `url(${this.state[`updateUrl0${this.state.setIndex + 1}`]})`;
    this[`appendEle0${this.state.setIndex + 1}`].style.backgroundSize = '100% 100%';
    this.ctxShow.clearRect(0, 0, 500, 500);
    this.mediaStreamTrack.getTracks().forEach(function (track) {
      track.stop();
    });
  };
  handleCancel = () => {
    this.setState({ visible: false });
    if(this.ctxShow) {
      this.ctxShow.clearRect(0, 0, 500, 500);
    }
    this.mediaStreamTrack.getTracks().forEach(function (track) {
      track.stop();
    });
  };
  ownerModel = () => {
    return (
      <Modal
        width={1000}
        visible={this.state.visible}
        title="Title"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" onClick={this.handleCancel}>取消</Button>,
          <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleOk}>
            确认
          </Button>
        ]}
      >
        <div>
          <div style={{'display': 'flex'}}>
            <div>
              <video id="video" width="500px" height="500px" muted="muted">您的浏览器不支持拍照上传功能</video>
            </div>
            <div>
              <canvas id="canvasShow" width="300px" height="300px" style={{'marginLeft': '100px'}}></canvas>
            </div>
          </div>
          <div>
            <Button onClick={() => {
              this.takePhoto();
            }} style={{'marginLeft': '10px'}}>拍照</Button>
          </div>
        </div>
      </Modal>
    );
  };
  startEle = (filed) => {
    const doc = document;
    const label = doc.querySelector(`label[for="${filed}"]`);
    const sp = doc.createElement('i');
    sp.innerText = '*';
    sp.style.color = 'red';
    sp.style.position = 'absolute';
    sp.style.left = '-10px';
    sp.style.top = '-8px';
    label.style.position = 'relative';
    label.appendChild(sp);
  };
  componentDidMount() {
    setTimeout(() => {
      this.startEle('positiveIdCardImageUrl');
      this.startEle('negativeIdCardImageUrl');
      this.startEle('handIdCardImageUrl');
      this.startEle('attendancePicture');
    }, 300);
    this.getElement();
  }
  render() {
    const fields = [{
      field: 'positiveIdCardImageUrl',
      title: '身份证正面照(小于500KB)',
      type: 'img',
      single: true,
      formatter: (v) => {
        if(this.isIndex === 0) {
          if(v) {
            this.isIndex = 1;
            clearTimeout(this.time);
          }else {
            if(this.time) {
              clearTimeout(this.time);
            }
            this.time = setTimeout(() => {
              this.spanElement();
              this.isIndex = 1;
            }, 400);
          }
        }
        return(v);
      },
      imgSize: 512000
    }, {
      field: 'negativeIdCardImageUrl',
      title: '身份证反面照(小于500KB)',
      type: 'img',
      single: true,
      imgSize: 512000
    }, {
      title: '手持身份证照片(小于500KB)',
      field: 'handIdCardImageUrl',
      type: 'img',
      single: true,
      imgSize: 512000
    }, {
      title: '考勤人脸照(小于500KB)',
      field: 'attendancePicture',
      type: 'img',
      single: true,
      imgSize: 512000
    }, {
      field: 'userId',
      value: getUserId(),
      hidden: true
    }, {
      field: 'code',
      value: this.code,
      hidden: true
    }];
    return this.props.buildDetail({
      fields,
      code: this.code,
      detailCode: 631806,
      editCode: 631791,
      beforeDetail: (params) => {
        params.userId = getUserId();
      },
      onOk: () => {
        setTimeout(() => {
          this.props.history.push(`/staff/jiandang/step3?code=${this.code}`);
        }, 300);
      },
      onCancel: () => {
        this.props.history.push(`/staff/jiandang?code=${this.code}`);
      },
      ownerModel: this.ownerModel,
      beforeSubmit: (params) => {
        if(this.state.upUrl01) {
          params.positiveIdCardImageUrl = this.state.upUrl01;
        }
        if(this.state.upUrl02) {
          params.negativeIdCardImageUrl = this.state.upUrl02;
        }
        if(this.state.upUrl03) {
          params.handIdCardImageUrl = this.state.upUrl03;
        }
        if(this.state.updateUrl04) {
          params.attendancePicture = this.state.updateUrl04;
        }
        if(!params.positiveIdCardImageUrl || !params.negativeIdCardImageUrl || !params.handIdCardImageUrl || !params.attendancePicture) {
          message.warning('请填写完整');
          return false;
        }else {
          return params;
        }
      }
    });
  }
}

export default JiandangStep2;
