import React from 'react';
import './projectStaff-addContract.css';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/projectStaff/projectStaff-addedit';
import { Pagination, Select } from 'antd';
import { getQueryString, showSucMsg, formatDate, getUserKind, formatImg, moneyFormat } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { getBankNameByCode } from 'api/project';
import { getUserId, getUserDetail, query1, getEmploy, getEmployContract, getEmployContractList, uploadContract } from 'api/user';
import { getDict } from 'api/dict';
import { getQiniuToken } from 'api/general';
import request from 'superagent-bluebird-promise';
import {Base64} from 'js-base64';
import Contract from './contract.png';
import Delete from './delete.png';
import {showWarnMsg} from '../../../common/js/util';

const {Option} = Select;

class ProjectStaffAddContract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      video: false,
      shot: false,
      contractPics: [],
      page: 1,
      pageSize: 8,
      deviceId: '',
      devices: []
    };
    this.code = getQueryString('code', this.props.location.search);
    this.projectCode = getQueryString('projectCode', this.props.location.search);
    this.idNo = getQueryString('idNo', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
    this.contractPics = [];
  }
  componentDidMount() {
    this.getdeviceId();
    getQiniuToken().then((res) => {
      this.token = res.uploadToken;
    });
    getEmployContractList({
      projectCode: this.projectCode,
      code: this.code
    }).then((res) => {
      if(res[0]) {
        res = res[0].contentPicList.map(item => {
          return {
            url: item,
            isOrigin: true
          };
        });
        this.setState({ contractPics: res });
      }
    });
  }
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
  };
  // 打开摄像头
  openVideo(deviceId) {
    console.log(deviceId);
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
  handleShotClick = () => {
    this.state.shot === true ? this.shot() : this.cancel();
  };
  // 拍照
  shot() {
    this.cutImg();
  }
  cancel() {
    this.setState({
      video: true,
      shot: true
    });
  };
  // 截取图像
  cutImg = () => {
    this.setState({
      video: false,
      imgFlag: false,
      shot: false
    });
    this.context = this.canvas.getContext('2d');
    this.canvas.width = 340 * 3;
    this.canvas.height = 440 * 3;
    let scaleH = this.video.videoHeight / 440;
    let scaleW = this.video.videoWidth / 340;
    if (scaleH > scaleW) {
      let sy = (this.video.videoHeight - 440 * scaleW) / 2;
      this.context.drawImage(this.video, 0, sy, this.video.videoWidth, 440 * scaleW, 0, 0, 340 * 3, 440 * 3);
    } else {
      let sx = (this.video.videoWidth - scaleH * 340) / 2;
      this.context.drawImage(this.video, sx, 0, scaleH * 340, this.video.videoHeight, 0, 0, 340 * 3, 440 * 3);
    }
    let img = this.canvas.toDataURL('image/jpeg');
    this.contractPics = this.state.contractPics;
    this.contractPics.push({
      url: img,
      isOrigin: false
    });
    this.setState({ contractPics: this.contractPics });
  };
  // 生成合同照片
  createContractNodes = (page, pageSize) => {
    let comps = [];
    for (let i = pageSize * (page - 1), end = pageSize * page; i < this.state.contractPics.length && i < end; i++) {
      comps.push(
          <div className="contract-item" key={i}>
            <img src={formatImg(this.state.contractPics[i].url)} />
            <div className="contract-close" onClick={ () => { this.deleteContract(i); } }>
              <img src={Delete} alt=""/>
            </div>
          </div>
      );
    }
    return comps;
  };
  // 分页页码改变事件
  onChange = (page, pageSize) => {
    this.setState({ page, pageSize });
  };
  // 删除合同事件
  deleteContract = (i) => {
    let { contractPics } = this.state;
    contractPics.splice(i, 1);
    this.setState({ contractPics });
  };
  // 最后提交事件
  handleSubmit = () => {
    let contractArr = this.state.contractPics.map((item) => {
      if(!item.isOrigin) {
        return this.uploadByBase64(item.url);
      }
      return Promise.resolve({body: {key: item.url}});
    });
    Promise.all(contractArr).then(([...res]) => {
      let photos = res.map(v => v.body.key);
      uploadContract({
        contentPicList: photos,
        code: this.code,
        updater: getUserId()
      }).then((res) => {
        if(res.code) {
          showSucMsg('操作成功');
          this.props.history.push(`/projectStaff/projectStaff`);
        } else {
          showWarnMsg('操作失败');
        }
      });
    }).catch(() => {});
  };
  // 上传七牛
  uploadByBase64(base64) {
    base64 = base64.substr(base64.indexOf('base64,') + 7);
    var timestamp = (new Date()).valueOf();
    var key = Base64.encode(timestamp + '0845.jpg');
    // return request.post('http://up-z2.qiniu.com/putb64/-1/key/' + key)
    return request.post('https://upload-z2.qiniu.com/putb64/-1/key/' + key)
      .set('Content-Type', 'application/octet-stream')
      .set('Authorization', `UpToken ${this.token}`)
      .send(base64)
      .promise();
  };
  deviceChange = (v) => {
    this.setState({deviceId: v});
    if (v) {
      this.cancel();
      this.openVideo(v);
    }
  }
  render() {
    return (
        <div className="contract-total">
          <div className="addContract-title"><i></i><span>证件补录</span></div>
          <div className="addContract-select">
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
          <div className="addContract-content">
            <div className="cut-contract">
              <div className="contract-video-box" style={{ display: this.state.video ? 'block' : 'none' }} onClick={ this.handleShotClick }>
                <div className="figure"><img src={Contract} alt=""/></div>
                <video ref={video => this.video = video} className="contract-video"></video>
              </div>
              <div className="contract-img-box" style={{ display: this.state.video ? 'none' : 'block' }} onClick={ this.handleShotClick }>
                <div className="border">
                  <span></span><span></span><span></span><span></span>
                  <img src={Contract} className="contract-cartoon"/>
                </div>
                <div className="tips">
                  <span>用工合同</span>
                  <span>点击拍摄</span>
                </div>
                <canvas ref={canvas => this.canvas = canvas}className="contract-canvas" style={{ width: '340px', height: '440px' }} width="1020" height="1320"></canvas>
              </div>
            </div>
            <div className="showContract">
              {this.createContractNodes(this.state.page, this.state.pageSize)}
              <Pagination total={this.state.contractPics.length}
                          pageSize={8}
                          current={this.state.page}
                          onChange={this.onChange}
                          style={{ display: this.state.contractPics.length === 0 ? 'none' : 'block' }}/>
            </div>
          </div>
          <div style={{ paddingTop: 20 }}>
            <div className="btn-item3" style={{ textAlign: 'center' }}>
              <div>
                <button className="ant-btn ant-btn-primary ant-btn-lg" style={{ width: 250 }} id="cut" onClick={ this.handleSubmit }>完成</button>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default ProjectStaffAddContract;
