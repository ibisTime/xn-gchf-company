import React from 'react';
import {
  setTableData,
  setPagination,
  setBtnList,
  setSearchParam,
  clearSearchParam,
  doFetching,
  cancelFetching,
  setSearchData
} from '@redux/yewuManage/account';
import { listWrapper } from 'common/js/build-list';
import { getUserDetail } from 'api/user';
import { getZhiHang } from 'api/project';
import { getUserKind, getUserId, dateTimeFormat, showSucMsg, showWarnMsg } from 'common/js/util';
import { Form, Input, Select, Button } from 'antd';
import { UPLOAD_URL, ruzhiFormItemLayout } from 'common/js/config';
import fetch from 'common/js/fetch';
import './account.css';

const rule0 = {
  required: true,
  message: '必填字段'
};
const FormItem = Form.Item;

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      projectCode: '',
      projectName: '',
      zhihang: [],
      updateDatetime: '',
      code: '',
      disabled: true,
      accountName: '',
      bankcardNumber: '',
      bankSubbranch: ''
    };
  }
  componentDidMount() {
    Promise.all([
      getUserDetail(getUserId()),
      getZhiHang()
    ]).then(([user, zhihang]) => {
      this.setState({
        projectCode: user.projectCode,
        projectName: user.projectName,
        zhihang: zhihang,
        updateDatetime: ''
      });
      fetch(631365, { projectCode: this.state.projectCode, start: 1, limit: 10 }).then((res) => {
        this.props.form.setFieldsValue({
          accountName: res.list[0].accountName,
          bankcardNumber: res.list[0].bankcardNumber,
          bankSubbranch: res.list[0].bankSubbranch
        });
        this.setState({
          accountName: res.list[0].accountName,
          bankcardNumber: res.list[0].bankcardNumber,
          bankSubbranch: res.list[0].bankSubbranch,
          updateDatetime: res.list[0].updateDatetime,
          code: res.list[0].code
        });
      });
    }).catch(() => this.setState({ fetching: false }));
  }
  edit = () => {
    this.setState({ disabled: false });
  };
  save = () => {
    this.props.form.validateFieldsAndScroll((err, params) => {
      if (!err) {
        params.updater = getUserId();
        params.code = this.state.code;
        this.state.zhihang.map((item) => {
          if (params.bankSubbranch === item.bankSubbranchName || params.bankSubbranch === item.code) {
            params.bankName = item.bankName;
            params.bankCode = item.bankCode;
            params.subbranch = item.subbranchName;
          }
        });
        this.setState({ fetching: true });
        fetch(631362, params).then((res) => {
          if(res.isSuccess) {
            showSucMsg('操作成功');
            this.setState({ disabled: true });
            this.setState({
              accountName: params.accountName,
              bankcardNumber: params.bankcardNumber,
              bankSubbranch: params.bankName + params.subbranch,
              updateDatetime: dateTimeFormat(new Date())
            });
          } else {
            showWarnMsg('操作失败');
          }
          this.props.cancelFetching();
        }).catch(() => { this.setState({ fetching: false }); });
      } else {
        console.log(err);
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return this.state.projectName ? (
        <div className="big">
          <div className="title">{this.state.projectName}账户信息</div>
          <Form>
            <FormItem label="工资专户户名" {...ruzhiFormItemLayout}>
              {getFieldDecorator('accountName', {
                rules: [rule0]
              })(
                  this.state.disabled
                      ? <span>{this.state.accountName}</span>
                      : <Input style={{ width: '280px' }} placeholder="请输入工资专户户名"/>
              )}
            </FormItem>
            <FormItem label="工资专户账户" {...ruzhiFormItemLayout}>
              {getFieldDecorator('bankcardNumber', {
                rules: [rule0]
              })(
                  this.state.disabled
                      ? <span>{this.state.bankcardNumber}</span>
                      : <Input style={{ width: '280px' }} placeholder="请输入工资专户账户"/>
              )}
            </FormItem>
            <FormItem label="工资专户开户行" {...ruzhiFormItemLayout}>
              {getFieldDecorator('bankSubbranch', {
                rules: [rule0]
              })(
                  this.state.disabled
                      ? <span>{this.state.bankSubbranch}</span>
                      : <Select style={{ width: '280px' }} placeholder="请选择工资专户开户行">
                        {this.state.zhihang.map((item) => <Option key={item.code} value={item.code}>{item.bankSubbranchName}</Option>)}
                      </Select>
              )}
            </FormItem>
          </Form>
          <div className="updateDateTime">更新时间:{dateTimeFormat(this.state.updateDatetime)}</div>
          <div style={{ textAlign: 'center' }}>
            {this.state.disabled
                ? <Button style={{background: '#74c363'}} onClick={this.edit}>修改账户信息</Button>
                : <Button style={{background: '#74c363'}} onClick={this.save}>保存</Button>
            }
          </div>
        </div>
    ) : null;
  }
}

export default Form.create()(Account);
