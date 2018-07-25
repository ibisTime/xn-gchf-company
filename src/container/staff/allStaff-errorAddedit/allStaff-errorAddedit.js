import React from 'react';
import { Timeline, Button, Card, Input, Divider, Table, Icon, Spin, Form, Checkbox } from 'antd';
import fetch from 'common/js/fetch';
import { getQueryString, showSucMsg, formatDate, getUserKind } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { getBankNameByCode } from 'api/project';
import { getUserId, getUserDetail, getUserErrorInfo, getUserWagesInfo, senderrInfo } from 'api/user';

const { TextArea } = Input;
const FormItem = Form.Item;

class AllStaffAddEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      errordata: '',
      loading: true
    };
    this.code = getQueryString('code', this.props.location.search);
  }
  componentDidMount() {
    Promise.all([
      getUserErrorInfo(this.code),
      getUserWagesInfo(this.code)
    ]).then(([errordata, data]) => {
      this.setState({
        errordata,
        data,
        loading: false
      });
    }).catch(() => this.setState({ loading: false }));
  };
  goBack() {
    this.props.history.go(-1);
  };
  Transformation() {
    this.props.history.push(`/staff/allStaff/error/Edit?code=${this.code}`);
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values['handleNote']);
        this.sendInfo(values['handleNote']);
      }
    });
  }
  sendInfo(handleNote) {
    this.setState({ loading: true });
    senderrInfo(this.code, handleNote, getUserId()).then(() => {
      showSucMsg('发送成功！');
      this.props.form.resetFields();
      getUserErrorInfo(this.code).then(errordata => {
        this.setState({ errordata, loading: false });
      }).catch(() => this.setState({ loading: false }));
    }).catch(() => this.setState({ loading: false }));
  };
  render() {
    var list = (length) => {
      var res = [];
      if (!length) {
        res.push(
          <p>没有异常处理记录!</p>
        );
      } else {
        for (let i = 0; i < length; i++) {
          res.push(
            <div key={i} style={{ margin: 10 }}>
              <span style={{ margin: 10 }}>处理日期: {formatDate(this.state.errordata[i].handleDatetime) || '没有记录'}</span>
              <span style={{ margin: 10 }}>处理人: {this.state.errordata[i].handleName || '没有记录'}</span>
              <span style={{ margin: 10 }}>处理信息: {this.state.errordata[i].handleNote || '没有记录'}</span>
            </div>
          );
        }
      }
      return res;
    };
    const { getFieldDecorator } = this.props.form;
    if (getUserKind() === 'S') {
      return (
        <Spin spinning={this.state.loading}>
          <h3 style={{ textAlign: 'center' }}>异常处理</h3>
          <p>姓名：{this.state.data.staffName}</p>
          <p>所属公司：{this.state.data.companyName}</p>
          <p>所属工程：{this.state.data.projectName}</p>
          <p>工程负责人名称：{this.state.data.projectChargeUser}</p>
          <p>工程负责人手机号：{this.state.data.projectChargeUserMobile}</p>
          <p>应发工资：{this.state.data.factAmount / 1000}</p>
          <p>实发工资：{this.state.data.payAmount / 1000}</p>
          <p>工资所属月份：{this.state.data.month}</p>
          <Divider>异常处理报告</Divider>
          {list(this.state.errordata.length)}
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('handleNote', {
                rules: [{ required: true, message: '必填字段' }]
              })(
                  <TextArea placeholder="输入最新沟通情况" autosize={{ minRows: 2, maxRows: 6 }} style={{ width: 400 }} />
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>处理异常</Button>
              <Button onClick={this.Transformation.bind(this)} style={{ marginTop: 20 }}>转化为正常</Button>
              <Button onClick={this.goBack.bind(this)} style={{ marginTop: 20, marginLeft: 30 }}>返回</Button>
            </FormItem>
          </Form>
        </Spin>
      );
    }
    return (
      <Spin spinning={this.state.loading}>
        <h3 style={{ textAlign: 'center' }}>异常处理</h3>
        <p>姓名：{this.state.data.staffName}</p>
        <p>所属公司：{this.state.data.companyName}</p>
        <p>所属工程：{this.state.data.projectName}</p>
        <p>工程负责人名称：{this.state.data.projectChargeUser}</p>
        <p>工程负责人手机号：{this.state.data.projectChargeUserMobile}</p>
        <p>应发工资：{this.state.data.factAmount / 1000}</p>
        <p>实发工资：{this.state.data.payAmount / 1000}</p>
        <p>工资所属月份：{this.state.data.month}</p>
        <Divider>异常处理报告</Divider>
        {list(this.state.errordata.length)}
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('handleNote', {
              rules: [{ required: true, message: '必填字段' }]
            })(
              <TextArea placeholder="输入最新沟通情况" autosize={{ minRows: 2, maxRows: 6 }} style={{ width: 400 }} />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>处理异常</Button>
            <Button onClick={this.goBack.bind(this)}>返回</Button>
          </FormItem>
        </Form>
      </Spin>
    );
  }
}

export default Form.create()(AllStaffAddEdit);
