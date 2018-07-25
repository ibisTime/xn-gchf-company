import React from 'react';
import axios from 'axios';
import './salaryCard.css';

class salaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'text': '',
            'mediaStreamTrack': '',
            'realName': '',
            'backCardNumber': '',
            'bankName': '',
            'subbranch': ''

        };
        this.openVideo = this.openVideo.bind(this);
        this.cutImg = this.cutImg.bind(this);
        // this.getFeat = this.getFeat.bind(this);
        // this.clickImg = this.clickImg.bind(this);
        // this.kaoqin = this.kaoqin.bind(this);
        this.next = this.next.bind(this);
        this.inputValuerName = this.inputValuerName.bind(this);
        this.inputValueBackCardNumber = this.inputValueBackCardNumber.bind(this);
        this.inputValueBankName = this.inputValueBankName.bind(this);
        this.inputValueSubbranch = this.inputValueSubbranch.bind(this);
        this.upload = this.upload.bind(this);
        this.submitBtn = this.submitBtn.bind(this);
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
                setTimeout(function() {
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
                setTimeout(function() {
                    this.video.play();
                }, 300);
            }, function(err) {
                console.log(err);
            });
        }
      };
        // 截取图像
    cutImg() {
        document.getElementById('userImg').style.display = 'none';
        document.getElementById('canvas').style.display = 'display';
        this.context.drawImage(this.video, 0, 0, 285, 285);
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
      inputValueName() {
        let value = document.getElementById('realName').value;
        this.setState({
            name: value
        });
    };
    upload(info) {
        info.idKind = 1;
        document.getElementById('submitBtn')[0].setAttribute('disabled', true);
        this.state({
            spanTi: '提交中...'
        });
        axios.post('/api', {
            code: 631411,
            json: JSON.stringify(info)
        }).then(rs => {
            document.getElementById('submitBtn').setAttribute('disabled', false);
            this.state({
                spanTi: '提交'
            });
            if (rs.errorCode === '0') {
                alert('提交成功成功');
                this.props.history.push(`/staff/jiandang/mianguanRead`);
            } else {
                alert(rs.errorInfo || '提交失败');
            }
        });
    };
    submitBtn (e) {
        e.preventDefault();
        var params = [
            { realName: this.state.realName },
            { backCardNumber: this.state.backCardNumber },
            { bankName: this.state.bankName },
            { subbranch: this.state.subbranch }
        ];
        var info = {};
        for (var i = 0; i < params.length; i++) {
            var val = params[i].value;
            if (val === 'undefined' || val === '') {
                alert(this.dict[params[i].name] + '不能为空');
                return;
            }
            info[params[i].name] = params[i].value;
        }
        if (this.idPic) {
            // info.feat = this.feat;
            info.idPic = this.idPic;
            info.pic1 = this.canvas.toDataURL('image/jpeg');
            this.upload(info);
        } else if (!this.idPic) {
            alert('请先读取工资卡信息');
        }
    };
    inputValuerName() {
        let value = document.getElementById('realName').value;
        this.setState({
            name: value
        });
    };
    inputValueBackCardNumber() {
        let value = document.getElementById('backCardNumber').value;
        this.setState({
            backCardNumber: value
        });
    };
    inputValueBankName() {
        let value = document.getElementById('bankName').value;
        this.setState({
            bankName: value
        });
    };
    inputValueSubbranch() {
        let value = document.getElementById('subbranch').value;
        this.setState({
            subbranch: value
        });
    };
  render() {
    return (
        <div className='SectionContainer'>
            <div className='section'>
                <div style={{ display: 'table-cell', verticalAlign: 'middle', width: '100%' }}>
                    <div className="comparison-mainl">
                        <div className="left-wrapper">
                            <div className="left-top">
                                <div className="head-wrap"><i></i>工资卡读取</div>
                                <div className="left-cont">
                                  <div className="left-inner" id="leftInner">
                                    <div id="idPicSlib">
                                        <div className='img'>
                                        <img id='userImg' src='../img/gongzika.png'/>
                                        <canvas id="canvas" className="inner-item" width="200" height="200"></canvas>
                                        </div>
                                    </div>
                                    <div className="img-wrap left-img" style={{ display: 'none' }}>
                                        <video id="video" className="video"></video>
                                    </div>
                                  </div>
                                </div>
                                <button id="getCard" className="ant-btn ant-btn-primary ant-btn-lg" onClick={ this.cutImg } style={{ marginTop: 190 }}><span>工资卡点击拍摄</span></button>
                            </div>
                        </div>
                        <div className="right-wrapper">
                        <div className="head-wrap"><i></i>银行卡详细信息</div>
                        <div className="right-bottom">
                            <form className="ant-form ant-form-horizontal" id="formId">
                                <div className="ant-row ant-form-item">
                                    <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                                        <label htmlFor="realName" className="ant-form-item-required">姓名</label>
                                    </div>
                                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-14">
                                        <div className="ant-form-item-control ">
                                            <input type="text" id="realName" name="realName" className="ant-input ant-input-lg" onChange={ this.inputValuerName }/>
                                        </div>
                                    </div>
                                </div>
                                <div className="ant-row ant-form-item">
                                    <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                                        <label htmlFor="bankName" className="ant-form-item-required">银行</label>
                                    </div>
                                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-14">
                                        <div className="ant-form-item-control ">
                                            <input type="text" id="bankName" name="bankName" className="ant-input ant-input-lg" onChange={ this.inputValueBankName }/>
                                        </div>
                                    </div>
                                </div>
                                <div className="ant-row ant-form-item">
                                    <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                                        <label htmlFor="subbranch" className="ant-form-item-required">支行</label>
                                    </div>
                                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-14">
                                        <div className="ant-form-item-control ">
                                            <input type="text" id="subbranch" name="subbranch" className="ant-input ant-input-lg" onChange={ this.inputValueSubbranch }/>
                                        </div>
                                    </div>
                                </div>
                                <div className="ant-row ant-form-item">
                                    <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                                        <label htmlFor="backCardNumber" className="ant-form-item-required">卡号</label>
                                    </div>
                                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-14">
                                        <div className="ant-form-item-control ">
                                            <input type="text" id="backCardNumber" name="backCardNumber" className="ant-input ant-input-lg" onChange={ this.inputValueBackCardNumber }/>
                                        </div>
                                    </div>
                                </div>
                                <div className="ant-row ant-form-item">
                                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-xs-offset-0 ant-col-sm-14 ant-col-sm-offset-6">
                                        <div className="ant-form-item-control ">
                                        <button id="submitBtn" className="ant-btn ant-btn-primary ant-btn-lg" onClick={ this.submitBtn }><span>提交</span></button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }
}

export default salaryCard;