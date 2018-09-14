import React from 'react';
import axios from 'axios';
import originJsonp from 'jsonp';
import './jiandang.css';
import { Form, Input, Button, Select, DatePicker, Spin } from 'antd';
import { formItemLayout, tailFormItemLayout, jiandangFormItemLayout } from 'common/js/config';
import { jiandang, getUserId, getUserDetail, getStaffDetail } from 'api/user';
import { queryStaffDetail } from 'api/staff';
import { showWarnMsg, showSucMsg, dateFormat } from 'common/js/util';
import locale from 'common/js/lib/date-locale';
import Avatar from './touxiang.png';
import Moment from 'moment';

const FormItem = Form.Item;
function jsonp(url, data, option) {
  return new Promise((resolve, reject) => {
    originJsonp(url, {
      name: 'getinfo',
      timeout: 2000
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
      realName: '',
      sex: '',
      idNation: '',
      birthday: '',
      idNo: '',
      idAddress: '',
      idStartDate: '',
      idEndDate: '',
      idPolice: '',
      idPic: '',
      spanText: '',
      spanTi: '',
      next: false,
      new: true,
      fetching: false
    };
    this.openVideo = this.openVideo.bind(this);
    this.getCard = this.getCard.bind(this);
    this.upload = this.upload.bind(this);
  }
  componentDidMount() {
    // 获取媒体方法（旧方法)
    this.setState({ fetching: true });
    getUserDetail(getUserId()).then((data) => {
      this.setState({ fetching: false });
      this.companyCode = data.companyCode;
      navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMeddia || navigator.msGetUserMedia;
      this.canvas = document.getElementById('canvas');
      this.mediaStreamTrack = '';
    }).catch(() => { this.setState({ fetching: false }); });
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
    document.getElementById('nextBtn').setAttribute('disabled', true);
    this.setState({ spanText: '读取中...' });
    jsonp('http://127.0.0.1:8080/readidcard')
        .then((data) => {
          this.setState({ spanText: '读取身份证' });
          if(data.resultCode === '-101' || data.resultCode === '-102') {
            jsonp('http://127.0.0.1:9081/readidcard')
                .then((res) => {
                  this.setState({ spanText: '读取身份证' });
                  this.setState({
                    realName: res.m_name,
                    sex: res.m_sex,
                    idNation: res.m_nation,
                    birthday: res.m_birth,
                    idNo: res.m_idcode,
                    idAddress: res.m_addr,
                    idStartDate: res.StartDate || res.m_termday.split('-')[0],
                    idEndDate: res.EndDate || res.m_termday.split('-')[1],
                    idPolice: res.m_depart,
                    idPic: res.pic,
                    isIdpic: true
                  });
                  let birthday = Moment(this.state.birthday);// 参数换成毫秒的变量就OK
                  let idStartDate = Moment(this.state.idStartDate);
                  let idEndDate = Moment(this.state.idEndDate);
                  this.props.form.setFieldsValue({
                    realName: this.state.realName,
                    sex: this.state.sex,
                    idNation: this.state.idNation,
                    birthday: birthday,
                    idNo: this.state.idNo,
                    idAddress: this.state.idAddress,
                    idStartDate: idStartDate,
                    idEndDate: idEndDate,
                    idPolice: this.state.idPolice
                  });
                  document.getElementById('nextBtn').removeAttribute('disabled');
                }).catch(() => {
              this.setState({ spanText: '读取身份证' });
              showWarnMsg('身份证信息读取失败，请把身份证放置准确后再次读取');
              document.getElementById('getCard').removeAttribute('disabled');
            });
          }
          this.setState({
            realName: data.m_name,
            sex: data.m_sex,
            idNation: data.m_nation,
            birthday: data.m_birth,
            idNo: data.m_idcode,
            idAddress: data.m_addr,
            idStartDate: data.StartDate || data.m_termday.split('-')[0],
            idEndDate: data.EndDate || data.m_termday.split('-')[1],
            idPolice: data.m_depart,
            idPic: data.pic,
            isIdpic: true
          });
          // 重置input的值
          let birthday = Moment(this.state.birthday);// 参数换成毫秒的变量就OK
          let idStartDate = Moment(this.state.idStartDate);
          let idEndDate = Moment(this.state.idEndDate);
          this.props.form.setFieldsValue({
            realName: this.state.realName,
            sex: this.state.sex,
            idNation: this.state.idNation,
            birthday: birthday,
            idNo: this.state.idNo,
            idAddress: this.state.idAddress,
            idStartDate: idStartDate,
            idEndDate: idEndDate,
            idPolice: this.state.idPolice
          });
          document.getElementById('nextBtn').removeAttribute('disabled');
        }).catch((e) => {
          jsonp('http://127.0.0.1:9081/readidcard')
              .then((res) => {
                this.setState({ spanText: '读取身份证' });
                this.setState({
                  realName: res.m_name,
                  sex: res.m_sex,
                  idNation: res.m_nation,
                  birthday: res.m_birth,
                  idNo: res.m_idcode,
                  idAddress: res.m_addr,
                  idStartDate: res.StartDate || res.m_termday.split('-')[0],
                  idEndDate: res.EndDate || res.m_termday.split('-')[1],
                  idPolice: res.m_depart,
                  idPic: res.pic,
                  isIdpic: true
                });
                let birthday = Moment(this.state.birthday);// 参数换成毫秒的变量就OK
                let idStartDate = Moment(this.state.idStartDate);
                let idEndDate = Moment(this.state.idEndDate);
                this.props.form.setFieldsValue({
                  realName: this.state.realName,
                  sex: this.state.sex,
                  idNation: this.state.idNation,
                  birthday: birthday,
                  idNo: this.state.idNo,
                  idAddress: this.state.idAddress,
                  idStartDate: idStartDate,
                  idEndDate: idEndDate,
                  idPolice: this.state.idPolice
                });
                document.getElementById('nextBtn').removeAttribute('disabled');
              }).catch(() => {
            this.setState({ spanText: '读取身份证' });
            showWarnMsg('身份证信息读取失败，请把身份证放置准确后再次读取');
            document.getElementById('getCard').removeAttribute('disabled');
          });
    });
  };
  isNew = (code) => {
    // getStaffDetail(this.state.idNo).then((res) => {
    //   if (!res.idNo) {
    //     this.setState({new: true});
    //   }
    //   if (res.pic1 || res.pict1) {
    //     this.setState({
    //       next: true
    //     });
    //   }
    //   document.getElementById('nextBtn').removeAttribute('disabled');
    // });
    this.setState({ fetching: true });
    queryStaffDetail(code).then((res) => {
      this.setState({ fetching: false });
      if (res.pic1 || res.pict1) {
        this.setState({
          new: false,
          next: true
        });
      }
    }).catch(() => { this.setState({ fetching: false }); });
  };
  // 提交
  handleSubmit = (e) => {
    e.preventDefault();
    // if(this.state.next) {
    //   showSucMsg('您已建过档');
    //   this.props.history.push(`/staff/jiandang/mianguanRead1?ruzhi=1&pict1=true&idNo=${this.state.idNo}`);
    //   return;
    // }
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ idNo: values.idNo, fetching: true });
        let format = 'YYYY-MM-DD';
        jiandang(
            values.birthday.format(format),
            values.idAddress,
            values.idEndDate.format(format),
            values.idNation,
            values.idNo,
            this.state.idPic,
            values.idPolice,
            values.idStartDate.format(format),
            values.realName,
            this.state.sex || values.sex,
            getUserId(),
            this.companyCode
        ).then((res) => {
          this.setState({ fetching: false });
          this.isNew(res.code);
          if(res.code) {
            if(this.state.new) {
              showSucMsg('建档成功');
              setTimeout(() => {
                this.props.history.push(`/staff/jiandang/mianguanRead?ruzhi=1&code=${res.code}&idNo=${this.state.idNo}`);
              }, 300);
            } else {
              showSucMsg('您已建过档');
              setTimeout(() => {
                this.props.history.push(`/staff/jiandang/mianguanRead1?ruzhi=1&pict1=true&idNo=${this.state.idNo}`);
              }, 300);
            }
          }else {
            showWarnMsg('建档失败');
          }
        }).catch(() => { this.setState({ fetching: false }); });
      } else {
        document.getElementById('getCard').removeAttribute('disabled');
      }
    });
  };
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
        <Spin spinning={this.state.fetching}>
          <div className="SectionContainer jiandang">
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
                    <div className="head-wrap"><i></i>身份证信息采集</div>
                    <div className="right-bottom jiandang-content">
                      <Form className="ant-form ant-form-horizontal" id="formId" onSubmit={this.submitBtn}>
                        <FormItem label="姓名" {...jiandangFormItemLayout}>
                          {getFieldDecorator('realName', {
                            rules: [{
                              required: true,
                              message: '必填字段'
                            }],
                            initialValue: this.state.realName
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
                            initialValue: this.state.sex
                          })(
                              <Select placeholder="请选择性别" onChange={ this.handleTypeChange }>
                                <Option key='男' value='男'>男</Option>
                                <Option key='女' value='女'>女</Option>
                              </Select>
                          )}
                        </FormItem>
                        <FormItem label="民族" {...jiandangFormItemLayout}>
                          {getFieldDecorator('idNation', {
                            rules: [{
                              required: true,
                              message: '必填字段'
                            }]
                          })(
                              <Input value={this.state.idNation} />
                          )}
                        </FormItem>
                        <FormItem label="出生日期" {...jiandangFormItemLayout}>
                          {getFieldDecorator('birthday', {
                            rules: [{
                              required: true,
                              message: '必填字段'
                            }]
                          })(
                              <DatePicker
                                  allowClear={false}
                                  locale={locale}
                                  placeholder="请选择出生日期"
                                  format='YYYY-MM-DD' />
                          )}
                        </FormItem>
                        <FormItem label="身份证号码" {...jiandangFormItemLayout}>
                          {getFieldDecorator('idNo', {
                            rules: [{
                              required: true,
                              message: '必填字段'
                            }]
                          })(
                              <Input value={this.state.idNo} />
                          )}
                        </FormItem>
                        <FormItem label="地址" {...jiandangFormItemLayout}>
                          {getFieldDecorator('idAddress', {
                            rules: [{
                              required: true,
                              message: '必填字段'
                            }]
                          })(
                              <Input value={this.state.idAddress} />
                          )}
                        </FormItem>
                        <FormItem label="有效开始日期" {...jiandangFormItemLayout}>
                          {getFieldDecorator('idStartDate', {
                            rules: [{
                              required: true,
                              message: '必填字段'
                            }]
                          })(
                              <DatePicker
                                  allowClear={false}
                                  locale={locale}
                                  placeholder="请选择有效开始日期"
                                  format='YYYY-MM-DD' />
                          )}
                        </FormItem>
                        <FormItem label="有效截止日期" {...jiandangFormItemLayout}>
                          {getFieldDecorator('idEndDate', {
                            rules: [{
                              required: true,
                              message: '必填字段'
                            }]
                          })(
                              <DatePicker
                                  allowClear={false}
                                  locale={locale}
                                  placeholder="请选择有效截止日期"
                                  format='YYYY-MM-DD'
                              />
                          )}
                        </FormItem>
                        <FormItem label="签发机关" {...jiandangFormItemLayout}>
                          {getFieldDecorator('idPolice', {
                            rules: [{
                              required: true,
                              message: '必填字段'
                            }]
                          })(
                              <Input value={this.state.idPolice} />
                          )}
                        </FormItem>
                        <FormItem key='btns' {...tailFormItemLayout}>
                          <Button type="primary" htmlType="submit" id="nextBtn" onClick={this.handleSubmit} >下一步</Button>
                        </FormItem>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Spin>
    );
  }
}

export default Form.create()(Jiandang);