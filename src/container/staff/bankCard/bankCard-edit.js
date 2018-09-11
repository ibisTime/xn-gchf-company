import React from 'react';
import originJsonp from 'jsonp';
import { Form, Button, Input, Select } from 'antd';
import { getQueryString, showSucMsg, showWarnMsg } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { getBankNameByCode, getZhiHang } from 'api/project';
import { getUserId } from 'api/user';
import { editBankCard, queryBankCardDetail } from 'api/staff';
import { weekdayItemLayout } from 'common/js/config';
import warning from './warning.png';
import './../../../common/css/blueTitle.css';
import './bankCard-edit.css';

const FormItem = Form.Item;

class BankCardAddEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zhihang: []
    };
    this.code = getQueryString('code', this.props.location.search);
    this.staffCode = getQueryString('staffCode', this.props.location.search);
    this.name = getQueryString('name', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }
  componentDidMount() {
    queryBankCardDetail(this.code).then((res) => {
      console.log(res);
      this.bankcardNumber = res.bankcardNumber;
      this.props.form.setFieldsValue({
        bankcardNumber: res.bankcardNumber,
        bankSubbranchName: res.bankSubbranchName
      });
    });
    getZhiHang().then((res) => {
      this.setState({
        zhihang: res
      });
    });
  }
  jsonp = (url, data, option) => {
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
  };
  getbankcard = () => {
    this.jsonp('http://127.0.0.1:8080/readbankcard')
          .then((res) => {
              this.setState({
                bankcardNumber: res.CardNo
              });
            this.props.form.setFieldsValue({
              bankcardNumber: this.state.bankcardNumber
            });
          }).catch(() => {
              this.setState({ spanText: '读取银行卡号' });
              showWarnMsg('银行卡号读取失败，请把银行卡放置准确后再次读取');
          });
  };
  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, params) => {
      if (!err) {
        for (let i = 0; i < this.state.zhihang.length; i++) {
          if (params.bankSubbranchName === this.state.zhihang[i].bankSubbranchName || params.bankSubbranchName === this.state.zhihang[i].code) {
            params.bankName = this.state.zhihang[i].bankName;
            params.bankCode = this.state.zhihang[i].bankCode;
            params.subbranch = this.state.zhihang[i].subbranchName;
          }
        }
        params.code = this.code;
        params.projectCode = this.projectCode;
        params.employCode = this.code;
        editBankCard(params).then((res) => {
          if(res.isSuccess) {
            showSucMsg('提交成功！');
            setTimeout(() => {
              this.props.history.go(-1);
            }, 500);
          } else {
            showWarnMsg('提交失败！');
          }
        });
      } else {
        console.log(err);
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { zhihang } = this.state;
    const rule0 = {
      required: true,
      message: '必填字段'
    };
    return (
      <div>
        <div className="blue-title"><i></i><span>离职</span></div>
        <div>
          <div>
            <div>
              <div className="addBankCard-content">
                <Form>
                  <FormItem label="姓名" {...weekdayItemLayout}>
                    {getFieldDecorator('staffName')(
                        <span>{this.name}</span>
                    )}
                  </FormItem>
                  <FormItem label="开户行" {...weekdayItemLayout}>
                    {getFieldDecorator('bankSubbranchName', {
                      rules: [rule0]
                    })(
                        <Select placeholder="请选择开户行" onChange={ this.handleTypeChange }>
                          {zhihang.map((item) => <Option key={item.code} value={item.code}>{item.bankSubbranchName}</Option>)}
                        </Select>
                    )}
                  </FormItem>
                  <FormItem label="卡号" {...weekdayItemLayout}>
                    {getFieldDecorator('bankcardNumber', {
                      rules: [rule0]
                    })(
                        <Input placeholder="请输入银行卡号"/>
                    )}
                    <Button onClick={ this.getbankcard }>读取</Button>
                  </FormItem>
                  <div className="addBankCard-tips">
                    <img src={warning} alt=""/><span>购买本司设备，确保卡号准确无误</span>
                  </div>
                  <div className="addBankCard-buttons">
                    <Button type="primary" onClick={ this.handleSubmit }>保存</Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create()(BankCardAddEdit);
