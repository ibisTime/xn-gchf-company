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
import { Modal, Button, message } from 'antd';
import DetailUtil from 'common/js/build-detail-dev';

let eleObj = {
  spEle01: null,
  spEle02: null,
  spEle03: null
};
@DetailWrapper(
  state => state.jiandangStep2,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class JiandangStep2 extends DetailUtil {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
    this.ctxShow = null;
    this.time = null;
    this.isIndex = 0;
  }
  state = {
    visible: false,
    updateUrl01: '',
    updateUrl02: '',
    updateUrl03: '',
    isDelete01: false,
    isDelete02: false,
    isDelete03: false,
    setIndex: 0
  };
  spanElement = (index) => {
    if(index || index === 0) {
      const pictureCard = document.querySelectorAll('.ant-upload-select-picture-card')[index];
      const cardSpan = document.querySelectorAll('.ant-upload-select-picture-card>span')[index];
      setTimeout(() => {
        pictureCard.style.display = 'inline-block';
        pictureCard.style.lineHeight = '104px';
        cardSpan.style.display = 'inline-block';
        cardSpan.style.verticalAlign = 'baseline';
      }, 300);
    }else {
      const pictureCardAll = document.querySelectorAll('.ant-upload-select-picture-card');
      const cardAllSpan = document.querySelectorAll('.ant-upload-select-picture-card>span');
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
    const ele01 = document.querySelectorAll('.ant-form-item-control')[0];
    const ele02 = document.querySelectorAll('.ant-form-item-control')[1];
    const ele03 = document.querySelectorAll('.ant-form-item-control')[2];
    eleObj.spEle01 = document.createElement('div');
    eleObj.spEle02 = document.createElement('div');
    eleObj.spEle03 = document.createElement('div');
    ele01.style.marginBottom = '20px';
    ele02.style.marginBottom = '20px';
    ele03.style.marginBottom = '20px';
    eleObj.spEle01.style.margin = '0px 30px 20px';
    eleObj.spEle01.style.display = 'inline-block';
    eleObj.spEle02.style.margin = '0px 30px 20px';
    eleObj.spEle02.style.display = 'inline-block';
    eleObj.spEle03.style.margin = '0px 30px 20px';
    eleObj.spEle03.style.display = 'inline-block';
    eleObj.spEle01.innerText = '或';
    eleObj.spEle02.innerText = '或';
    eleObj.spEle03.innerText = '或';
    ele01.appendChild(eleObj.spEle01);
    ele02.appendChild(eleObj.spEle02);
    ele03.appendChild(eleObj.spEle03);
    this.appendEle01 = document.createElement('div');
    this.appendEle02 = document.createElement('div');
    this.appendEle03 = document.createElement('div');
    this.appendEle01.style.width = '100px';
    this.appendEle01.style.height = '100px';
    this.appendEle01.style.lineHeight = '100px';
    this.appendEle01.style.textAlign = 'center';
    this.appendEle01.style.display = 'inline-block';
    this.appendEle01.style.border = '1px solid #dedede';
    this.appendEle01.style.cursor = 'pointer';
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
    this.appendEle01.addEventListener('click', () => {
      this.showModal();
      this.setState({
        setIndex: 0,
        isDelete01: false
      }, () => {
        const antion = document.querySelectorAll('.ant-upload-list-picture-card')[0].children[0];
        if(antion) {
          antion.children[1].children[1].click();
        }
        setTimeout(() => {
          this.spanElement(0);
        }, 500);
      });
    });
    this.appendEle02.style.width = '100px';
    this.appendEle02.style.height = '100px';
    this.appendEle02.style.lineHeight = '100px';
    this.appendEle02.style.textAlign = 'center';
    this.appendEle02.style.display = 'inline-block';
    this.appendEle02.style.border = '1px solid #dedede';
    this.appendEle02.style.cursor = 'pointer';
    this.appendEle02.innerText = '拍照上传';
    this.appendEle02.addEventListener('click', () => {
      this.showModal();
      this.setState({
        setIndex: 1,
        isDelete02: false
      }, () => {
        const antion = document.querySelectorAll('.ant-upload-list-picture-card')[1].children[0];
        if(antion) {
          antion.children[1].children[1].click();
        }
        setTimeout(() => {
          this.spanElement(1);
        }, 500);
      });
    });
    this.appendEle03.style.width = '100px';
    this.appendEle03.style.height = '100px';
    this.appendEle03.style.lineHeight = '100px';
    this.appendEle03.style.textAlign = 'center';
    this.appendEle03.style.display = 'inline-block';
    this.appendEle03.style.border = '1px solid #dedede';
    this.appendEle03.style.cursor = 'pointer';
    this.appendEle03.innerText = '拍照上传';
    this.appendEle03.addEventListener('click', () => {
      this.showModal();
      this.setState({
        setIndex: 2,
        isDelete03: false
      }, () => {
        const antion = document.querySelectorAll('.ant-upload-list-picture-card')[2].children[0];
        if(antion) {
          antion.children[1].children[1].click();
        }
        setTimeout(() => {
          this.spanElement(2);
        }, 500);
      });
    });
    ele01.appendChild(this.appendEle01);
    ele02.appendChild(this.appendEle02);
    ele03.appendChild(this.appendEle03);
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
    promise.then(function (MediaStream) {
      video.srcObject = MediaStream;
      video.play();
    });
  };
  takePhoto = () => {
    // 获得Canvas对象
    let video = document.getElementById('video');
    let canvasShow = document.getElementById('canvasShow');
    this.ctxShow = canvasShow.getContext('2d');
    this.ctxShow.drawImage(video, 0, 0, 300, 300);
    const dataUrl = canvasShow.toDataURL();
    console.log(dataUrl);
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
  };
  handleCancel = () => {
    this.setState({ visible: false });
    this.ctxShow.clearRect(0, 0, 500, 500);
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
  componentDidMount() {
    setTimeout(() => {
      const label01 = document.querySelector(`label[for="positiveIdCardImageUrl"]`);
      const label02 = document.querySelector(`label[for="negativeIdCardImageUrl"]`);
      const label03 = document.querySelector(`label[for="handIdCardImageUrl"]`);
      const sp01 = document.createElement('i');
      const sp02 = document.createElement('i');
      const sp03 = document.createElement('i');
      sp01.innerText = '*';
      sp02.innerText = '*';
      sp03.innerText = '*';
      sp01.style.color = 'red';
      sp02.style.color = 'red';
      sp03.style.color = 'red';
      sp01.style.position = 'absolute';
      sp02.style.position = 'absolute';
      sp03.style.position = 'absolute';
      sp01.style.left = '-10px';
      sp01.style.top = '-8px';
      sp02.style.left = '-10px';
      sp02.style.top = '-8px';
      sp03.style.left = '-10px';
      sp03.style.top = '-8px';
      label01.style.position = 'relative';
      label02.style.position = 'relative';
      label03.style.position = 'relative';
      label01.appendChild(sp01);
      label02.appendChild(sp02);
      label03.appendChild(sp03);
    }, 300);
    this.getElement();
  }
  render() {
    const fields = [{
      field: 'positiveIdCardImageUrl',
      title: '身份证正面照',
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
      title: '身份证反面照',
      type: 'img',
      single: true,
      imgSize: 512000
    }, {
      title: '手持身份证照片',
      field: 'handIdCardImageUrl',
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
    return this.buildDetail({
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
        if(this.state.updateUrl01) {
          params.positiveIdCardImageUrl = this.state.updateUrl01;
        }
        if(this.state.updateUrl02) {
          params.negativeIdCardImageUrl = this.state.updateUrl02;
        }
        if(this.state.updateUrl03) {
          params.handIdCardImageUrl = this.state.updateUrl03;
        }
        if(!params.positiveIdCardImageUrl || !params.negativeIdCardImageUrl || !params.handIdCardImageUrl) {
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
