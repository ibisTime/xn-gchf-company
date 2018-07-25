import React from 'react';
import fetch from 'common/js/fetch';
import { Input, Select, Button, Form, DatePicker, Modal, TreeSelect } from 'antd';
import { getProjectListForO, getBumen, getZhiHang } from 'api/project';
import { getUserDetail, getUserId, ruzhi, reruzhi, getStaffDetail } from 'api/user';
import { getDict } from 'api/dict';
import { getQiniuToken } from 'api/general';
import { getQueryString, showErrMsg, showWarnMsg, showSucMsg, formatImg, dateFormat, moneyFormat } from 'common/js/util';
import { UPLOAD_URL, ruzhiFormItemLayout } from 'common/js/config';
import locale from 'common/js/lib/date-locale';
import Moment from 'moment';

import './ruzhiInfo.css';

const InputGroup = Input.Group;
const Option = Select.Option;
const FormItem = Form.Item;
const { TreeNode } = TreeSelect;

const rule0 = {
  required: true,
  message: '必填字段'
};
class RuzhiInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectList: [],
      department1: [],
      department2: [],
      department3: [],
      selectProj: '',
      selectDepart: '',
      selectSource: '',
      source: [],
      type: '',
      token: '',
      previewImage: '',
      previewVisible: false,
      staffCode: '',
      companyCode: '',
      defaultProject: '',
      departmentList: [],
      zhihang: [],
      bank: []
    };
    this.handleProjectChange = this.handleProjectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.code = getQueryString('code', this.props.location.search);
    this.idNo = getQueryString('idNo', this.props.location.search);
    this.reruzhi = getQueryString('reruzhi', this.props.location.search);
    this.staffCode = getQueryString('staffCode', this.props.location.search);
  }
  componentDidMount() {
    getUserDetail(getUserId()).then((res) => {
      this.companyCode = res.companyCode;
      getProjectListForO({companyCode: res.companyCode, status: '3'}).then((data) => {
        this.projectList = data.map((item) => ({
          code: item.code,
          name: item.name
        }));
        this.setState({
          projectList: this.projectList,
          selectProj: this.projectList[0].code,
          companyCode: res.companyCode
        });
      });
    });
    getZhiHang().then((res) => {
      this.setState({
        zhihang: res
      });
    });
    getDict('staff_type').then((res) => {
      this.source = res.map((item) => ({
        type: item.dkey,
        name: item.dvalue
      }));
      this.setState({
        source: this.source
      });
    });
    getQiniuToken().then(data => {
      this.setState({ token: data.uploadToken });
    }).catch(() => {});
    if(this.idNo) {
      getStaffDetail(this.idNo).then((res) => {
        this.setState({
          staffCode: res.code
        });
      });
    }
    if(this.reruzhi) {
      fetch(631467, { code: this.code }).then((data) => {
        data.joinDatetime = dateFormat(data.joinDatetime);
        var formatTime = Moment(data.joinDatetime);// 参数换成毫秒的变量就OK
        this.props.form.setFieldsValue({
          projectCode: data.projectName,
          departmentCode: data.departmentName,
          position: data.position,
          joinDatetime: formatTime,
          cutAmount: data.cutAmount / 1000,
          salary: data.salary / 1000,
          subbranch: data.bankCard ? data.bankCard.bankSubbranchName : '',
          bankcardNumber: data.bankCard ? data.bankCard.bankcardNumber : ''
          // type: data.type
        });
        this.state.projectList.map((item) => {
          if(data.projectName === item.name) {
            getBumen({ projectCode: item.code }).then((data) => {
              this.setState({ departmentList: data });
              this.getTree(data);
            });
          }
        });
      });
      this.setState({
        defaultProject: <Option>123</Option>
      });
    }
  }
  // 员工source change事件
  handleTypeChange(value) {
    this.setState({
      selectSource: value
    });
  }
  // 最终提交
  handleSubmit() {
    // let info = {
    //   departmentCode: this.state.selectDepart,
    //   projectCode: this.state.selectProj,
    // };
    this.props.form.validateFieldsAndScroll((err, params) => {
      if (!err) {
        let format = 'YYYY-MM-DD';
        params.joinDatetime = params.joinDatetime.format(format);
        params.updater = getUserId();
        params.cutAmount *= 1000;
        params.salary *= 1000;
        params.staffCode = this.state.staffCode || '';
        this.state.zhihang.map((item) => {
          if(params.subbranch === item.code || params.subbranch === item.bankSubbranchName) {
            params.bankCode = item.bankCode;
            params.bankName = item.bankName;
            params.subbranch = item.subbranchName;
          };
        });
        if(this.reruzhi) {
          params.code = this.code;
          this.state.projectList.map((item) => {
            if(params.projectCode === item.name) {
              params.projectCode = item.code;
              this.state.departmentList.map((v) => {
                if(params.departmentCode === v.name) {
                  params.departmentCode = v.code;
                }
              });
              // console.log(params);
              reruzhi(params).then((res) => {
                if(res.isSuccess) {
                  showSucMsg('重新入职成功！');
                  this.props.history.push(`/projectStaff/projectStaff`);
                } else {
                  showWarnMsg('重新入职失败！');
                }
              });
            }
          });
        } else {
          params.staffCode = this.code || this.state.staffCode;
          params.companyCode = this.state.companyCode;
          ruzhi(params).then((res) => {
            if(res.code) {
              showSucMsg('入职成功！');
              this.props.history.push(`/staff/jiandang`);
            } else {
              showWarnMsg('入职失败！');
            }
          });
        }
      }
    });
  }
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
  // 项目change事件
  handleProjectChange(projectCode) {
    this.props.form.setFieldsValue({ departmentCode: '' });
    getBumen({ projectCode }).then((data) => {
      this.getTree(data);
    });
  }
  // 生成tree
  getTree(data) {
    let result = {};
    data.forEach(v => {
      v.parentCode = v.parentCode === '' ? 'ROOT' : v.parentCode;
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
    const { previewVisible, previewImage, token, source } = this.state;
    const { getFieldDecorator } = this.props.form;
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
      <div className='SectionContainer2' style={{ border: '2px solid #096dd9' }}>
        <div className='section2'>
          <div style={{ verticalAlign: 'middle', width: '100%' }}>
              <div className="comparison-main2 comparison-mains2">
                <div className="head-wrap2"><i></i>入职信息</div>
                  <div style={{ width: 600, padding: '30px 0', margin: '0 auto' }}>
                    <Form>
                      <div style={{ fontWeight: 700, marginBottom: 10, textAlign: 'center' }}>入职信息</div>
                      {
                        this.reruzhi
                            ? (<FormItem label="项目" {...ruzhiFormItemLayout}>
                              {getFieldDecorator('projectCode', {
                                rules: [rule0]
                              })(
                                  <Select placeholder="请选择项目" onChange={this.handleProjectChange} disabled>
                                    {this.state.projectList.map((item) => <Option key={item.code} value={item.code}>{item.name}</Option>)}
                                  </Select>
                              )}
                            </FormItem>)
                            : (
                                <FormItem label="项目" {...ruzhiFormItemLayout}>
                                  {getFieldDecorator('projectCode', {
                                    rules: [rule0]
                                  })(
                                      <Select placeholder="请选择项目" onChange={this.handleProjectChange} defaultValue={this.defaultProject}>
                                        {this.state.projectList.map((item) => <Option key={item.code} value={item.code}>{item.name}</Option>)}
                                      </Select>
                                  )}
                                </FormItem>
                            )
                      }
                      <FormItem label="部门" {...ruzhiFormItemLayout}>
                        {getFieldDecorator('departmentCode', {
                          rules: [rule0]
                        })(
                          <TreeSelect
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder="请选择部门"
                            allowClear
                            treeDefaultExpandAll
                          >
                            {this.renderTreeNodes(this.state.treeData)}
                          </TreeSelect>
                        )}
                      </FormItem>
                      <FormItem label="职位" {...ruzhiFormItemLayout}>
                        {getFieldDecorator('position', {
                          rules: [rule0]
                        })(
                          <Input placeholder="请输入职位"/>
                        )}
                      </FormItem>
                      <FormItem label="日薪" {...ruzhiFormItemLayout}>
                        {getFieldDecorator('salary', {
                          rules: [rule0]
                        })(
                          <Input style={{ width: '280px' }} placeholder="请输入日薪"/>
                        )}
                        <span>元</span>
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
                      <FormItem label="迟到/早退每小时扣款金额" {...ruzhiFormItemLayout}>
                        {getFieldDecorator('cutAmount', {
                          rules: [rule0]
                        })(
                          <Input style={{ width: '280px' }} placeholder="请输入迟到/早退每小时扣款金额"/>
                        )}
                        <span>元</span>
                      </FormItem>
                      <div style={{ fontWeight: 700, marginBottom: 10, textAlign: 'center' }}>银行卡信息（选填）</div>
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
                      </FormItem>

                      <div style={{ fontWeight: 700, marginBottom: 10, textAlign: 'center' }}>员工来源</div>
                      <FormItem label="来源" {...ruzhiFormItemLayout}>
                        {getFieldDecorator('type', {
                          rules: [rule0],
                          initialValue: source.length ? source[0].type : ''
                        })(
                            <Select placeholder="请选择来源" onChange={ this.handleTypeChange }>
                              {source.map((item) => <Option key={item.type} value={item.type}>{item.name}</Option>)}
                            </Select>
                        )}
                      </FormItem>
                      <div style={{ textAlign: 'center' }}>
                        <Button type="primary" style={{ width: 300 }} onClick={ this.handleSubmit }>完成</Button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
          </div>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="图片" style={{ width: '100%' }} src={previewImage} />
          </Modal>
      </div>
    );
  }
}

export default Form.create()(RuzhiInfo);