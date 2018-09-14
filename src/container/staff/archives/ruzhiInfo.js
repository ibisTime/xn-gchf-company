import React from 'react';
import originJsonp from 'jsonp';
import fetch from 'common/js/fetch';
import { Input, Select, Button, Form, DatePicker, TreeSelect, Spin } from 'antd';
import { getProjectListForO, getBumen, getZhiHang, luru } from 'api/project';
import { getUserDetail, getUserId, ruzhi, reruzhi, getStaffDetail } from 'api/user';
import { getDict } from 'api/dict';
import { getQiniuToken } from 'api/general';
import { getQueryString, showErrMsg, showWarnMsg, showSucMsg, formatImg, dateFormat, moneyFormat, isUndefined } from 'common/js/util';
import { UPLOAD_URL, ruzhiFormItemLayout } from 'common/js/config';
import locale from 'common/js/lib/date-locale';
import Moment from 'moment';

import './ruzhiInfo.css';
import './../../../common/css/blueTitle.css';

const InputGroup = Input.Group;
const Option = Select.Option;
const FormItem = Form.Item;
const { TreeNode } = TreeSelect;

const rule0 = {
  required: true,
  message: '必填字段'
};
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
class RuzhiInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectProj: '',
      selectDepart: '',
      selectSource: '',
      source: [],
      type: '',
      token: '',
      previewImage: '',
      previewVisible: false,
      staffCode: '',
      projectCode: '',
      defaultProject: '',
      departmentList: [],
      zhihang: [],
      bank: [],
      position: [],
      departmentCode: '',
      salary: 0,
      cutAmount: 0,
      fetching: false
    };
    this.code = getQueryString('code', this.props.location.search);
    this.idNo = getQueryString('idNo', this.props.location.search);
    this.reruzhi = getQueryString('reruzhi', this.props.location.search);
    this.staffCode = getQueryString('staffCode', this.props.location.search);
  }
  componentDidMount() {
    this.setState({ fetching: true });
    Promise.all([
      getUserDetail(getUserId()),
      getZhiHang(),
      getDict('staff_type'),
      getQiniuToken(),
      getDict('position_type')
    ]).then(([res1, res2, res3, res4, res5]) => {
      this.source = res3.map((item) => ({
        type: item.dkey,
        name: item.dvalue
      }));
      this.setState({
        zhihang: res2,
        source: this.source,
        token: res4.uploadToken,
        position: res5
      });
      getUserDetail(getUserId()).then((res) => {
        this.setState({ projectCode: res.projectCode });
        getBumen({ projectCode: this.state.projectCode }).then((data) => {
          if(data.length === '0') {
            showWarnMsg('该项目暂无部门，即将前往添加...');
            setTimeout(() => {
              this.props.history.push(`/projectManage/project/addBumen`);
            }, 1000);
            return;
          }
          this.setState({ departmentList: data });
          this.getTree(data);
          this.props.form.setFieldsValue({
            cutAmount: this.state.cutAmount,
            salary: this.state.salary
          });
          if(this.reruzhi) {
            fetch(631467, { code: this.code }).then((data) => {
              data.joinDatetime = dateFormat(data.joinDatetime);
              var formatTime = Moment(data.joinDatetime);// 参数换成毫秒的变量就OK
              this.props.form.setFieldsValue({
                // departmentCode: data.departmentCode,
                position: data.position,
                joinDatetime: formatTime,
                cutAmount: data.cutAmount / 1000,
                salary: data.salary / 1000,
                subbranch: data.bankCard ? data.bankCard.bankSubbranchName : '',
                bankcardNumber: data.bankCard ? data.bankCard.bankcardNumber : '',
                type: data.type,
                mobile: data.staff.mobile,
                contacts: data.staff.contacts,
                contactsMobile: data.staff.contactsMobile
              });
              this.setState({departmentCode: data.departmentCode, fetching: false});
            });
          }
        });
        this.props.form.setFieldsValue({
          projectCode: res.projectName
        });
      });
    });
    if(this.idNo) {
      getStaffDetail(this.idNo).then((res) => {
        this.setState({
          staffCode: res.code,
          fetching: false
        });
      });
    }
  }
  // 员工source change事件
  handleTypeChange = (value) => {
    this.setState({
      selectSource: value
    });
  }
  // 读取银行卡号
  getbankcard = (e) => {
    e.preventDefault();
        this.setState({ spanText: '读取中...' });
        jsonp('http://127.0.0.1:8080/readbankcard')
          .then((res) => {
            if(res.resultCode !== '-101') {
              this.setState({
                bankcardNumber: res.CardNo
              });
              this.props.form.setFieldsValue({
                bankcardNumber: this.state.bankcardNumber
              });
            } else {
              showWarnMsg('银行卡号读取失败，请把银行卡放置准确后再次读取');
            }
          }).catch(() => {
              this.setState({ spanText: '读取银行卡号' });
              showWarnMsg('银行卡号读取失败，请把银行卡放置准确后再次读取');
          });
  };
  // 最终提交
  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, params) => {
      if (!err) {
        let format = 'YYYY-MM-DD';
        let luruParams = {
          code: this.staffCode,
          updater: getUserId(),
          bankName: params.bankName,
          bankCode: params.bankCode,
          mobile: params.mobile,
          contacts: params.contacts,
          contactsMobile: params.contactsMobile
        };
        if(params.subbranch) {
          this.state.zhihang.map((item) => {
            if(params.subbranch === item.code || params.subbranch === item.bankSubbranchName) {
              params.bankCode = item.bankCode;
              params.bankName = item.bankName;
              params.subbranch = item.subbranchName;
            }
          });
        }
        let ruzhiParams = {
          projectCode: this.state.projectCode,
          joinDatetime: params.joinDatetime.format(format),
          updater: getUserId(),
          cutAmount: params.cutAmount * 1000,
          salary: params.salary *= 1000,
          departmentCode: params.departmentCode,
          position: params.position,
          type: params.type,
          bankCode: params.bankCode,
          bankName: params.bankName,
          bankcardNumber: params.bankcardNumber,
          subbranch: params.subbranch
        };
        if(this.reruzhi) {
          // 重新入职
          ruzhiParams.code = this.code;
          Promise.all([
            reruzhi(ruzhiParams),
            luru(luruParams)
          ]).then(([res1, res2]) => {
            if(res1.isSuccess && res2.isSuccess) {
              showSucMsg('重新入职成功！');
              this.props.history.push(`/projectStaff/projectStaff`);
            } else {
              showWarnMsg('重新入职失败！');
            }
          });
        } else {
          // 入职
          ruzhiParams.staffCode = this.staffCode || this.state.staffCode;
          ruzhiParams.projectCode = this.state.projectCode;
          Promise.all([
            ruzhi(ruzhiParams),
            luru(luruParams)
          ]).then(([res1, res2]) => {
            if(res1.code && res2.isSuccess) {
              showSucMsg('入职成功！');
              this.props.history.push(`/staff/jiandang`);
            } else {
              showWarnMsg('入职失败！');
            }
          });
        }
      } else {
        console.log(err);
      }
    });
  };
  setUploadFileUrl(fileList) {
    fileList.forEach(f => {
      if (!f.url && f.status === 'done' && f.response) {
        f.url = formatImg(f.response.key);
      }
    });
  }
  normFile = (e) => {
    if (e) {
      return e.fileList.map(v => {
        if (v.status === 'done') {
          return v.key || v.response.key;
        } else if (v.status === 'error') {
          showErrMsg('文件上传失败');
        }
        return '';
      }).filter(v => v).join('||');
    }
    return '';
  };
  handleCancel = () => this.setState({ previewVisible: false })
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };
  // 生成tree
  getTree(data) {
    let result = {};
    data.forEach(v => {
      v.parentCode = v.parentCode === '' || isUndefined(v.parentCode) ? 'ROOT' : v.parentCode;
      if (!result[v.parentCode]) {
        result[v.parentCode] = [];
      }
      let obj = {
          title: v.name,
          key: v.code
      };
      result[v.parentCode].push(obj);
    });
    this.result = result;
    let tree = [];
    if (data.length) {
      this.getTreeNode(result['ROOT'], tree);
    }
    this.setState({ treeData: tree });
  }
  // 生成treeNode
  getTreeNode(arr, children) {
    arr.forEach(a => {
      if (this.result[a.key]) {
        a.children = [];
        children.push(a);
        this.getTreeNode(this.result[a.key], a.children);
      } else {
        children.push(a);
      }
    });
  }
  // 生成treeSelect结构
  renderTreeNodes = (data) => {
    if (!data) return null;
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} value={item.key}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.title} key={item.key} value={item.key}/>;
    });
  }
  render() {
    const { previewVisible, previewImage, token, source, position } = this.state;
    const { getFieldDecorator } = this.props.form;
    const rule1 = {
      pattern: /^1[3|4|5|7|8]\d{9}$/,
      message: '手机格式不对'
    };
    const imgProps = {
      action: UPLOAD_URL,
      multiple: true,
      data: { token },
      defaultFileList: [],
      showUploadList: {
        showPreviewIcon: true,
        showRemoveIcon: true
      },
      onChange: ({ fileList }) => this.setUploadFileUrl(fileList, true),
      onPreview: this.handlePreview,
      listType: 'picture-card',
      accept: 'image/*'
    };
    return (
      <Spin spinning={this.state.fetching}>
        <div>
          <div className="blue-title" style={{left: '-24px', top: '-24px', right: '-24px'}}><i></i><span>入职信息</span></div>
          <div>
            <div style={{ verticalAlign: 'middle', width: '100%' }}>
              <div className="comparison-main2 comparison-mains2 ruzhi-content">
                <div style={{ width: 600, padding: '30px 0', margin: '0 auto' }}>
                  <Form>
                    <div className="ruzhi-title">入职信息(必填)</div>
                    <FormItem label="入职部门" {...ruzhiFormItemLayout}>
                      {getFieldDecorator('departmentCode', {
                        rules: [rule0],
                        initialValue: this.state.departmentCode
                      })(
                          <TreeSelect
                              style={{ width: '100%' }}
                              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                              placeholder="请选择部门"
                              allowClear
                              treeDefaultExpandAll
                              className="ruzhi-item"
                          >
                            {this.renderTreeNodes(this.state.treeData)}
                          </TreeSelect>
                      )}
                    </FormItem>
                    <FormItem label="职位" {...ruzhiFormItemLayout}>
                      {getFieldDecorator('position', {
                        rules: [rule0]
                      })(
                          <Select placeholder="请选择职位" className="ruzhi-item">
                            {position.map((item) => <Option key={item.dkey} value={item.dkey}>{item.dvalue}</Option>)}
                          </Select>
                      )}
                    </FormItem>
                    <FormItem label="日薪" {...ruzhiFormItemLayout}>
                      {getFieldDecorator('salary', {
                        rules: [rule0]
                      })(
                          <Input placeholder="元/日" onblur="this.placeholder='元/日'"/>
                      )}
                    </FormItem>
                    <FormItem label="扣薪" {...ruzhiFormItemLayout}>
                      {getFieldDecorator('cutAmount', {
                        rules: [rule0]
                      })(
                          <Input placeholder="元/小时"/>
                      )}
                    </FormItem>
                    <FormItem label="入职时间" {...ruzhiFormItemLayout}>
                      {getFieldDecorator('joinDatetime', {
                        rules: [rule0]
                      })(
                          <DatePicker
                              allowClear={false}
                              locale={locale}
                              placeholder="请选择入职时间"
                              format='YYYY-MM-DD' />
                      )}
                    </FormItem>
                    <FormItem label="员工来源" {...ruzhiFormItemLayout}>
                      {getFieldDecorator('type', {
                        rules: [rule0],
                        initialValue: source.length ? source[0].type : ''
                      })(
                          <Select placeholder="请选择来源" onChange={ this.handleTypeChange }>
                            {source.map((item) => <Option key={item.type} value={item.type}>{item.name}</Option>)}
                          </Select>
                      )}
                    </FormItem>
                    <FormItem label="联系方式" {...ruzhiFormItemLayout} onChange={(e) => { this.mobileChange(e); }}>
                      {getFieldDecorator('mobile', {
                        rules: [rule0, rule1]
                      })(
                          <Input/>
                      )}
                    </FormItem>
                    <FormItem label="紧急联系人" {...ruzhiFormItemLayout}>
                      {getFieldDecorator('contacts', {
                        rules: [rule0]
                      })(
                          <Input/>
                      )}
                    </FormItem>
                    <FormItem label="紧急联系人联系方式" {...ruzhiFormItemLayout}>
                      {getFieldDecorator('contactsMobile', {
                        rules: [rule0, rule1]
                      })(
                          <Input/>
                      )}
                    </FormItem>
                    <div className="ruzhi-title">工资卡信息（选填）</div>
                    <FormItem label="开户行" {...ruzhiFormItemLayout}>
                      {getFieldDecorator('subbranch')(
                          <Select placeholder="请选择开户行" allowClear>
                            {this.state.zhihang.map((item) => <Option key={item.code} value={item.code}>{item.bankSubbranchName}</Option>)}
                          </Select>
                      )}
                    </FormItem>
                    <FormItem label="银行卡号" {...ruzhiFormItemLayout}>
                      {getFieldDecorator('bankcardNumber')(
                          <Input placeholder="请输入银行卡号"/>
                      )}
                      <Button onClick={this.getbankcard}>读取</Button>
                    </FormItem>
                    <div className="ruzhi-btns">
                      <Button type="primary" style={{ width: 300 }} onClick={ this.handleSubmit }>完成</Button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Spin>
    );
  }
}

export default Form.create()(RuzhiInfo);