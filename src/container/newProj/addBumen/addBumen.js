import React from 'react';
import { Form, Button, Input, Select } from 'antd';
import { getQueryString, showSucMsg, showWarnMsg } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { getBumen, addBumen, editBumen, getBumenDetail } from 'api/project';
import { getUserDetail, getUserId } from 'api/user';
import { bumenItemLayout } from 'common/js/config';
import './../../../common/css/blueTitle.css';
import './addBumen.css';
const FormItem = Form.Item;

class AddBumen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bumen: [],
      projectCode: '',
      parentCode: '',
      title: ''
    };
    this.bumenCode = getQueryString('bumenCode', this.props.location.search);
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
    this.upperBumen = getQueryString('upperBumen', this.props.location.search);
    this.projectCode = getQueryString('projectCode', this.props.location.search);
    if(this.upperBumen) {
      this.setState({
        parentCode: this.upperBumen
      });
    }
    // let this.title;
    if(this.code) {
      this.state.title = '修改部门';
    } else {
      this.state.title = '新增部门';
    }
  }
  componentDidMount() {
    this.setState({ projectCode: this.projectCode });
    getBumen({projectCode: this.projectCode}).then((data) => {
      this.setState({ bumen: data });
    });
    if(this.code) {
      // 修改
      getBumenDetail(this.code).then((res) => {
        this.props.form.setFieldsValue({
          name: res.name,
          leader: res.leader,
          leadeMobile: res.leadeMobile,
          parentCode: res.parentCode
        });
      });
    } else {
      // 新增
      getUserDetail(getUserId()).then((res) => {
        this.setState({
          projectCode: res.projectCode
        });
        getBumen({projectCode: this.state.projectCode}).then((data) => {
          this.setState({ bumen: data });
        });
      });
    }
  }
  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, params) => {
      if (!err) {
        params.projectCode = this.state.projectCode;
        if(this.code) {
          params.code = this.code;
          editBumen(params).then((res) => {
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
          addBumen(params).then((res) => {
            if(res.code) {
              showSucMsg('提交成功！');
              setTimeout(() => {
                this.props.history.go(-1);
              }, 500);
            } else {
              showWarnMsg('提交失败！');
            }
          });
        }
      } else {
        console.log(err);
      }
    });
  };
  back = () => {
    this.props.history.go(-1);
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { bumen, title } = this.state;
    const rule0 = {
      required: true,
      message: '必填字段'
    };
    return (
      <div>
        <div className="blue-title"><i></i><span>{title}</span></div>
        <div>
          <div>
            <div>
              <div className="quit-content">
                <Form>
                  <FormItem label="部门名称" {...bumenItemLayout}>
                    {getFieldDecorator('name', {
                      rules: [rule0]
                    })(
                        <Input style={{ width: '280px' }} placeholder="请输入部门名称"/>
                    )}
                  </FormItem>
                  <FormItem label="负责人" {...bumenItemLayout}>
                    {getFieldDecorator('leader', {
                      rules: [rule0]
                    })(
                        <Input style={{ width: '280px' }} placeholder="请输入负责人姓名"/>
                    )}
                  </FormItem>
                  <FormItem label="联系方式" {...bumenItemLayout}>
                    {getFieldDecorator('leadeMobile', {
                      rules: [rule0]
                    })(
                        <Input style={{ width: '280px' }} placeholder="请输入负责人联系方式"/>
                    )}
                  </FormItem>
                  <FormItem label="上级部门" {...bumenItemLayout}>
                    {getFieldDecorator('parentCode', {
                      initialValue: this.state.parentCode
                    })(
                        <Select placeholder="请选择上级部门">
                          {bumen.map((item) => <Option key={item.code} value={item.code}>{item.name}</Option>)}
                        </Select>
                    )}
                  </FormItem>
                  <div className="quit-buttons">
                    <Button type="primary" onClick={ this.handleSubmit }>保存</Button>
                    <Button onClick={ this.back }>返回</Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    // const fields = [{
    //   field: 'name',
    //   title: '部门名',
    //   required: true
    // }, {
    //   field: 'leader',
    //   title: '负责人',
    //   required: true
    // }, {
    //   field: 'leadeMobile',
    //   title: '负责人手机号',
    //   mobile: true,
    //   required: true
    // }, {
    //   field: 'parentCode',
    //   title: '上级部门',
    //   type: 'select',
    //   listCode: '631036',
    //   params: {
    //     projectCode: this.state.projectCode
    //   },
    //   keyName: 'code',
    //   valueName: 'name',
    //   value: this.upperBumen
    // }];
    //
    // return this.state.projectCode ? this.props.buildDetail({
    //   fields,
    //   key: 'code',
    //   code: this.code,
    //   view: this.view,
    //   addCode: 631030,
    //   editCode: 631032,
    //   detailCode: 631037,
    //   beforeSubmit: (param) => {
    //     param.projectCode = this.state.projectCode;
    //     return param;
    //   }
    // }) : null;
  }
}

export default Form.create()(AddBumen);
