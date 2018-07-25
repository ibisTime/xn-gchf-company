import React from 'react';
import axios from 'axios';
import originJsonp from 'jsonp';
import './jiandang.css';
import { Form, Input, Button } from 'antd';
import { formItemLayout, tailFormItemLayout, jiandangFormItemLayout } from 'common/js/config';
import { jiandang, getUserId, getUserDetail } from 'api/user';
import { showWarnMsg, showSucMsg } from 'common/js/util';
import Avatar from './touxiang.png';

const FormItem = Form.Item;
function jsonp(url, data, option) {
    return new Promise((resolve, reject) => {
        originJsonp(url, {
            name: 'getinfo'
        }, (err, data) => {
        if(!err) {
            resolve(data);
        } else {
            reject(err);
        }
        });
    });
}

class Jiandang extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'realName': '',
            'sex': '',
            'idNation': '',
            'birthday': '',
            'idNo': '',
            'idAddress': '',
            'idStartDate': '',
            'idEndDate': '',
            'idPolice': '',
            'idPic': '',
            'spanText': '',
            'spanTi': ''
        };
        this.openVideo = this.openVideo.bind(this);
        this.getCard = this.getCard.bind(this);
        this.upload = this.upload.bind(this);
      }
    componentDidMount() {
    // 获取媒体方法（旧方法）
        getUserDetail(getUserId()).then((data) => {
            this.companyCode = data.companyCode;
            navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMeddia || navigator.msGetUserMedia;
            this.canvas = document.getElementById('canvas');
            // this.context = this.canvas.getContext('2d');
            this.video = document.getElementById('video');
            // this.feat = '';
            this.mediaStreamTrack = '';
            this.openVideo();
        });
    };
    // 打开摄像头
    openVideo(argument) {
        // 使用新方法打开摄像头
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            }).then(function(stream) {
                this.mediaStreamTrack = typeof stream.stop === 'function' ? stream : stream.getTracks()[1];
                if (this.video.srcObject) {
                    this.video.srcObject = stream;
                } else {
                    this.video.src = (window.URL || window.webkitURL).createObjectURL(stream);
                }
                setTimeout(function() {
                    this.video.play();
                }, 100);
            }).catch(function(err) {
                console.log(err);
            });
        } else if (navigator.getMedia) { // 使用旧方法打开摄像头
            navigator.getMedia({
                video: true
            }, function(stream) {
                this.mediaStreamTrack = stream.getTracks()[0];
                if (this.video.srcObject) {
                    this.video.srcObject = stream;
                } else {
                    this.video.src = (window.URL || window.webkitURL).createObjectURL(stream);
                }
                setTimeout(function() {
                    this.video.play();
                }, 100);
            }, function(err) {
                console.log(err);
            });
        }
    };
    // 获取身份证信息
    getCard (e) {
        e.preventDefault();
        document.getElementById('getCard').setAttribute('disabled', true);
        this.setState({ spanText: '读取中...' });
        jsonp('http://127.0.0.1:9081/readidcard')
        .then((data) => {
            document.getElementById('getCard').setAttribute('disabled', false);
            this.setState({ spanText: '读取身份证' });
            if (data.ResultCode !== '0') {
                showWarnMsg('身份证信息读取失败，请把身份证放置准确后再次读取');
                document.getElementById('getCard').removeAttribute('disabled');
                return;
            }
            this.setState({
                realName: data.m_name,
                sex: data.m_sex,
                idNation: data.m_nation,
                birthday: data.m_birth,
                idNo: data.m_idcode,
                idAddress: data.m_addr,
                idStartDate: data.StartDate,
                idEndDate: data.EndDate,
                idPolice: data.m_depart,
                idPic: data.pic,
                isIdpic: true
            });
            console.log(this.state.realName);
          this.props.form.setFieldsValue({
            realName: this.state.realName,
            sex: this.state.sex,
            idNation: this.state.idNation,
            birthday: this.state.birthday,
            idNo: this.state.idNo,
            idAddress: this.state.idAddress,
            idStartDate: this.state.idStartDate,
            idEndDate: this.state.idEndDate,
            idPolice: this.state.idPolice
          });
            // let val = /^data:image/.test(data.idPic) ? data.idPic : 'data:image/bmp;base64,' + data.idPic;
            // this.setState({
            //     idPic: '123',
            //     isIdpic: true
            // });
        }).catch((e) => {
            alert(e);
            document.getElementById('getCard').setAttribute('disabled', false);
            this.setState({ spanText: '读取身份证' });
            showWarnMsg('身份证信息读取失败，请把身份证放置准确后再次读取');
            document.getElementById('getCard').removeAttribute('disabled');
        });
    };
    // 提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                jiandang(
                    values.birthday,
                    values.idAddress,
                    values.idEndDate,
                    values.idNation,
                    values.idNo,
                    this.state.idPic,
                    values.idPolice,
                    values.idStartDate,
                    values.realName,
                    this.state.sex,
                    getUserId(),
                    this.companyCode
                    ).then((res) => {
                        if(res.code) {
                            showSucMsg('建档成功');
                            setTimeout(() => {
                                this.props.history.push(`/staff/jiandang/mianguanRead?code=${res.code}`);
                            }, 300);
                        }else {
                            showWarnMsg('建档失败');
                        }
                    });
            } else {
              document.getElementById('getCard').removeAttribute('disabled');
            }
        });
    }
    // 获取特征值
    // getFeat() {
    //     document.getElementById('getFeat').setAttribute('disabled', true).getElementsByTagName('span').innerHTML = '获取中...';
    //     axios.post('/getfeature', this.canvas.toDataURL('image/jpeg'))
    //         .then(function(rs) {
    //             document.getElementById('getFeat').setAttribute('disabled', false).getElementsByTagName('span').innerHTML = '读取特征值';
    //             var result = /getFaceFeature\({data:([^]+)}\)/.exec(rs);
    //             if (!result || result[1] === 'NOFACE') {
    //                 alert('请对准人脸');
    //                 return;
    //             }
    //             this.feat = result[1];
    //         });
    // };
    // 提交建档数据
    upload(info) {
        info.idKind = 1;
        info.companyCode = this.companyCode;
        document.getElementById('submitBtn')[0].setAttribute('disabled', true);
        this.state({
            spanTi: '提交中...'
        });
        axios.post('/api', {
            code: 631410,
            json: JSON.stringify(info)
        }).then(rs => {
            document.getElementById('submitBtn').setAttribute('disabled', false);
            this.state({
                spanTi: '提交'
            });
            if (rs.errorCode === '0') {
                showSucMsg('建档成功');
                this.props.history.push(`/staff/J/mianguanRead`);
            } else {
                showWarnMsg(rs.errorInfo || '建档失败');
            }
        });
    };

  render() {
    const { idPic } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
        <div className="SectionContainer">
        <div className="section">
            <div style={{ display: 'table-cell', verticalAlign: 'middle', width: '100%' }}>
                <div className="comparison-main">
                    <div className="left-wrapper">
                        <div className="left-top">
                            <div className="head-wrap"><i></i>身份证头像</div>
                            <div className="left-cont">
                                <div className={idPic ? 'active' : 'left-inner'} id="leftInner">
                                {
                                idPic
                                    ? <img className="idImg" id="idPicImg" src={idPic} style={{ margin: '0 100px' }}/>
                                    : <div id="idPicSlib">
                                        <div className="img"><img src={Avatar}/></div>
                                        <div>上传身份证</div>
                                      </div>
                                }
                                </div>
                            </div>
                            <button id="getCard" className="ant-btn ant-btn-primary ant-btn-lg" onClick={ this.getCard }><span>{ this.state.spanText || '读取身份证' }</span></button>
                        </div>
                    </div>
                    <div className="right-wrapper">
                        <div className="head-wrap"><i></i>人脸信息采集</div>
                        <div className="right-bottom">
                            <Form className="ant-form ant-form-horizontal" id="formId" onSubmit={this.submitBtn}>
                                <FormItem label="姓名" {...jiandangFormItemLayout}>
                                    {getFieldDecorator('realName', {
                                        rules: [{
                                            required: true,
                                            message: '必填字段'
                                        }],
                                        initialValue: this.state.realName,
                                        value: this.state.realName
                                    })(
                                        <Input value={this.state.realName}/>
                                    )}
                                </FormItem>
                                <FormItem label="性别" {...jiandangFormItemLayout}>
                                    {getFieldDecorator('sex', {
                                        rules: [{
                                            required: true,
                                            message: '必填字段'
                                        }],
                                        initialValue: this.state.sex,
                                        value: this.state.sex
                                    })(
                                        <Input value={this.state.sex}/>
                                    )}
                                </FormItem>
                                <FormItem label="民族" {...jiandangFormItemLayout}>
                                    {getFieldDecorator('idNation', {
                                        rules: [{
                                            required: true,
                                            message: '必填字段'
                                        }],
                                        initialValue: this.state.idNation,
                                        value: this.state.idNation
                                    })(
                                        <Input value={this.state.idNation}/>
                                    )}
                                </FormItem>
                                <FormItem label="出生日期" {...jiandangFormItemLayout}>
                                    {getFieldDecorator('birthday', {
                                        rules: [{
                                            required: true,
                                            message: '必填字段'
                                        }],
                                        initialValue: this.state.birthday,
                                        value: this.state.birthday
                                    })(
                                        <Input value={this.state.birthday}/>
                                    )}
                                </FormItem>
                                <FormItem label="身份证号码" {...jiandangFormItemLayout}>
                                    {getFieldDecorator('idNo', {
                                        rules: [{
                                            required: true,
                                            message: '必填字段'
                                        }],
                                        initialValue: this.state.idNo,
                                        value: this.state.idNo
                                    })(
                                        <Input value={this.state.idNo}/>
                                    )}
                                </FormItem>
                                <FormItem label="地址" {...jiandangFormItemLayout}>
                                    {getFieldDecorator('idAddress', {
                                        rules: [{
                                            required: true,
                                            message: '必填字段'
                                        }],
                                        initialValue: this.state.idAddress,
                                        value: this.state.idAddress
                                    })(
                                        <Input value={this.state.idAddress}/>
                                    )}
                                </FormItem>
                                <FormItem label="有效开始日期" {...jiandangFormItemLayout}>
                                    {getFieldDecorator('idStartDate', {
                                        rules: [{
                                            required: true,
                                            message: '必填字段'
                                        }],
                                        initialValue: this.state.idStartDate,
                                        value: this.state.idStartDate
                                    })(
                                        <Input value={this.state.idStartDate}/>
                                    )}
                                </FormItem>
                                <FormItem label="有效截止日期" {...jiandangFormItemLayout}>
                                    {getFieldDecorator('idEndDate', {
                                        rules: [{
                                            required: true,
                                            message: '必填字段'
                                        }],
                                        initialValue: this.state.idEndDate,
                                        value: this.state.idEndDate
                                    })(
                                        <Input value={this.state.idEndDate}/>
                                    )}
                                </FormItem>
                                <FormItem label="签发机关" {...jiandangFormItemLayout}>
                                    {getFieldDecorator('idPolice', {
                                        rules: [{
                                            required: true,
                                            message: '必填字段'
                                        }],
                                        initialValue: this.state.idPolice,
                                        value: this.state.idPolice
                                    })(
                                        <Input value={this.state.idPolice}/>
                                    )}
                                </FormItem>
                                <FormItem key='btns' {...tailFormItemLayout}>
                                    <Button type="primary" htmlType="submit" onClick={this.handleSubmit} >下一步</Button>
                                </FormItem>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
  }
}

export default Form.create()(Jiandang);