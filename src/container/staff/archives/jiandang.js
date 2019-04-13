import React from 'react';
import axios from 'axios';
import originJsonp from 'jsonp';
import './jiandang.css';
import { Form, Input, Button, Select, DatePicker, Spin, Upload } from 'antd';
import { formItemLayout, tailFormItemLayout, jiandangFormItemLayout, DATE_FORMAT,
  UPLOAD_URL } from 'common/js/config';
import { jiandang, reJiandang, getUserId, getUserDetail, getStaffDetail } from 'api/user';
import { getDictList } from 'api/dict';
import { getQiniuToken } from 'api/general';
import { showWarnMsg, showSucMsg, getQueryString, dateFormat, isUndefined } from 'common/js/util';
import locale from 'common/js/lib/date-locale';
import Avatar from './touxiang.png';
import Moment from 'moment';
import fetch from 'common/js/fetch';

const { Option } = Select;

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
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

class Jiandang extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nextDisabled: false,
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
      new: true,
      maritalStatusData: [],
      cultureLevelTypeData: [],
      politicsTypeData: [],
      fetching: true,
      picLoading: false
    };
    this.openVideo = this.openVideo.bind(this);
    this.getCard = this.getCard.bind(this);
    this.code = getQueryString('code', this.props.location.search);
  }
  componentDidMount() {
    // 获取媒体方法（旧方法)
    // this.setState({ fetching: true });
    // getUserDetail(getUserId()).then((data) => {
    //   this.setState({ fetching: false });
    navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMeddia || navigator.msGetUserMedia;
    this.canvas = document.getElementById('canvas');
    this.mediaStreamTrack = '';
    // }).catch(() => { this.setState({ fetching: false }); });
    getDictList({ parentKey: 'politics_type' }).then(data => {
      this.setState({ politicsTypeData: data });
    });
    getDictList({ parentKey: 'culture_level_type' }).then(data => {
      this.setState({ cultureLevelTypeData: data });
    });
    getDictList({ parentKey: 'marital_status' }).then(data => {
      this.setState({ maritalStatusData: data });
    });
    // 重新建档
    if (this.code) {
      this.getUserInfo().then(this.getToken);
    } else {
      this.getToken();
    }
  };
  getToken = () => {
    getQiniuToken().then((data) => {
      this.setState({
        fetching: false,
        token: data.uploadToken
      });
    }).catch(() => this.setState({ fetching: false }));
  }
  getUserInfo() {
    return fetch(631806, {
      code: this.code,
      userId: getUserId()
    }).then(data => {
      this.setState({
        idPic: data.headImageUrl,
        fetching: false
      });
      this.props.form.setFieldsValue({
        realName: data.name,
        sex: data.gender + '',
        idNation: data.nation,
        birthday: this.getRealDate(data.birthday),
        idNo: data.idCardNumber,
        idAddress: data.address,
        idStartDate: this.getRealDate(data.startDate),
        idEndDate: this.getRealDate(data.expiryDate),
        idPolice: data.grantOrg,
        politicsType: data.politicsType,
        cultureLevelType: data.cultureLevelType,
        isJoined: isUndefined(data.isJoined) ? '' : data.isJoined + '',
        joinedTime: this.getRealDate(data.joinedTime),
        specialty: data.specialty,
        hasBadMedicalHistory: isUndefined(data.hasBadMedicalHistory) ? '' : data.hasBadMedicalHistory + '',
        maritalStatus: data.maritalStatus
      });
    }).catch(() => this.setState({ fetching: false }));
  }
  getRealDate(date) {
    return date ? Moment(dateFormat(date), DATE_FORMAT) : null;
  }
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
  setStateByCardData(data) {
    let sex = data.m_sex == '男' ? '0' : '1';
    this.setState({
      sex,
      realName: data.m_name,
      idNation: data.m_nation,
      birthday: data.m_birth,
      idNo: data.m_idcode,
      idAddress: data.m_addr,
      idStartDate: data.StartDate || data.m_termday.split('-')[0],
      idEndDate: data.EndDate || data.m_termday.split('-')[1],
      idPolice: data.m_depart,
      idPic: data.pic,
      isIdpic: true,
      nextDisabled: false,
      spanText: '读取身份证'
    }, () => {
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
    });
  }
  // 获取身份证信息
  getCard (e) {
    e.preventDefault();
    this.setState({
      nextDisabled: true,
      spanText: '读取中...'
    });
    jsonp('http://127.0.0.1:8080/readidcard').then((data) => {
      if (data.resultCode === '-101' || data.resultCode === '-102') {
        jsonp('http://127.0.0.1:9081/readidcard').then((res) => {
          this.setStateByCardData(res);
        }).catch(() => {
          this.setState({
            nextDisabled: false,
            spanText: '读取身份证'
          });
          showWarnMsg('身份证信息读取失败，请把身份证放置准确后再次读取');
        });
      } else {
        this.setStateByCardData(data);
      }
    }).catch((e) => {
      jsonp('http://127.0.0.1:9081/readidcard').then((res) => {
        this.setStateByCardData(res);
      }).catch(() => {
        this.setState({
          nextDisabled: false,
          spanText: '读取身份证'
        });
        showWarnMsg('身份证信息读取失败，请把身份证放置准确后再次读取');
      });
    });
  }
  // 提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ idNo: values.idNo, fetching: true });
        this.doSubmit(values).then((res) => {
          this.setState({ fetching: false });
          if (this.code && res.isSuccess) {
            this.submitSuc(this.code);
          } else if (res.code) {
            this.submitSuc(res.code);
          } else {
            showWarnMsg('建档失败');
          }
        }).catch(() => { this.setState({ fetching: false }); });
      } else {
        this.setState({ nextDisabled: false });
      }
    });
  }
  submitSuc(code) {
    showSucMsg('建档成功');
    setTimeout(() => {
      this.props.history.push(`/staff/jiandang/step2?code=${code}`);
    }, 300);
  }
  doSubmit(values) {
    let format = DATE_FORMAT;
    let joinedTime = values.joinedTime ? values.joinedTime.format(format) : '';
    if (this.code) {
      return reJiandang(
        this.code,
        values.birthday.format(format),
        values.idAddress,
        values.idEndDate.format(format),
        values.idNation,
        values.idNo,
        this.state.idPic,
        values.idPolice,
        values.idStartDate.format(format),
        values.realName,
        values.sex || this.state.sex,
        values.politicsType,
        values.cultureLevelType,
        values.isJoined,
        joinedTime,
        values.specialty,
        values.hasBadMedicalHistory,
        values.maritalStatus,
        getUserId()
      );
    }
    return jiandang(
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
      values.politicsType,
      values.cultureLevelType,
      values.isJoined,
      joinedTime,
      values.specialty,
      values.hasBadMedicalHistory,
      values.maritalStatus,
      getUserId()
    );
  }
  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ picLoading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, idPic => this.setState({
        idPic,
        picLoading: false
      }));
    }
  }
  render() {
    const { idPic, picLoading, token, fetching } = this.state;
    const uploadButton = (
      <Spin spinning={picLoading}>
        <div id="idPicSlib">
          <div className="img"><img src={Avatar}/></div>
          <div>上传身份证</div>
        </div>
      </Spin>
    );

    const { getFieldDecorator } = this.props.form;
    return (
      <Spin spinning={fetching}>
        <div className="SectionContainer jiandang">
          <div className="section">
            <div style={{ display: 'table-cell', verticalAlign: 'middle', width: '100%' }}>
              <div className="comparison-main" style={{ height: 970 }}>
                <div className="left-wrapper">
                  <div className="left-top" style={{ height: 970 }}>
                    <div className="head-wrap"><i></i>身份证头像</div>
                    <div className="left-cont">
                      <div className={idPic ? 'active jiandang-idpic-wrap' : 'left-inner jiandang-idpic-wrap'} style={{textAlign: 'center'}} id="leftInner">
                        {
                          !token ? null : (
                            <Upload
                              listType="picture-card"
                              showUploadList={false}
                              data={{ token }}
                              action={UPLOAD_URL}
                              onChange={this.handleChange}
                            >
                              {idPic ? <img src={idPic} alt="avatar" /> : uploadButton}
                            </Upload>
                          )
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
                            <Select placeholder="请选择性别">
                              <Option key='0' value='0'>男</Option>
                              <Option key='1' value='1'>女</Option>
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
                      <FormItem label="政治面貌" {...jiandangFormItemLayout}>
                        {getFieldDecorator('politicsType', {
                          rules: [{
                            required: true,
                            message: '必填字段'
                          }]
                        })(
                          <Select>{
                            this.state.politicsTypeData.map(d => (
                              <Option key={d.dkey} value={d.dkey}>{d.dvalue}</Option>
                            ))
                          }</Select>
                        )}
                      </FormItem>
                      <FormItem label="文化程度" {...jiandangFormItemLayout}>
                        {getFieldDecorator('cultureLevelType', {
                          rules: [{
                            required: true,
                            message: '必填字段'
                          }]
                        })(
                          <Select>{
                            this.state.cultureLevelTypeData.map(d => (
                              <Option key={d.dkey} value={d.dkey}>{d.dvalue}</Option>
                            ))
                          }</Select>
                        )}
                      </FormItem>
                      <FormItem label="是否加入公会" {...jiandangFormItemLayout}>
                        {getFieldDecorator('isJoined', {
                          initialValue: this.state.isJoined
                        })(
                            <Select placeholder="请选择">
                              <Option key='1' value='1'>是</Option>
                              <Option key='0' value='0'>否</Option>
                            </Select>
                        )}
                      </FormItem>
                      <FormItem label="加入公会时间" {...jiandangFormItemLayout}>
                        {getFieldDecorator('joinedTime', {})(
                            <DatePicker
                                allowClear={false}
                                locale={locale}
                                placeholder="请选择日期"
                                format='YYYY-MM-DD'
                            />
                        )}
                      </FormItem>
                      <FormItem label="特长" {...jiandangFormItemLayout}>
                        {getFieldDecorator('specialty', {})(
                            <Input value={this.state.specialty} />
                        )}
                      </FormItem>
                      <FormItem label="是否有重大病史" {...jiandangFormItemLayout}>
                        {getFieldDecorator('hasBadMedicalHistory', {
                          initialValue: this.state.hasBadMedicalHistory
                        })(
                            <Select placeholder="请选择">
                              <Option key='1' value='1'>是</Option>
                              <Option key='0' value='0'>否</Option>
                            </Select>
                        )}
                      </FormItem>
                      <FormItem label="婚姻状况" {...jiandangFormItemLayout}>
                        {getFieldDecorator('maritalStatus', {})(
                          <Select>{
                            this.state.maritalStatusData.map(d => (
                              <Option key={d.dkey} value={d.dkey}>{d.dvalue}</Option>
                            ))
                          }</Select>
                        )}
                      </FormItem>
                      <FormItem key='btns' {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" disabled={this.state.nextDisabled} id="nextBtn" onClick={this.handleSubmit} >下一步</Button>
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
