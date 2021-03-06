import React from 'react';
import { Form, Spin, Tree, Modal } from 'antd';
import { getCompany, getBumen, deleteCompany1, deleteBumen1, getCompanyDetail } from 'api/company';
import { setRoleMenus, getUserDetail } from 'api/user';
import { getBumen1, getProject } from 'api/project';
import { getQueryString, showSucMsg, showWarnMsg, getUserKind, getUserId } from 'common/js/util';
import { formItemLayout, tailFormItemLayout } from 'common/js/config';
import './project-addBumen.css';

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;

class ProjectAddBumen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      treeData: [],
      expandedKeys: [],
      checkedKeys: [],
      selectKey: '',
      stopGetTree1: false,
      companyName: '',
      companyCode: '',
      projectName: '',
      projecCode: ''
    };
    this.code = getQueryString('code');
    this.name = getQueryString('name');
  }
  componentDidMount() {
    Promise.all([
      getProject(this.code),
      getUserDetail(getUserId()),
      getBumen1({projectCode: this.code})
    ]).then(([data1, data2, data3]) => {
      this.setState({
        projectName: data1.name,
        projectCode: this.code,
        projecCode: data2.projecCode,
        fetching: false
      }, () => {
        this.getTree0(data3);
      });
    }).catch(() => this.setState({ fetching: false }));
  }
  res = {
    'key': 'company'
  }
  reSetData() {
    this.getTree();
  }
  getTree() {
    console.log(this.state);
    getBumen1({projectCode: this.state.projectCode}).then((data) => {
      this.getTree0(data);
    });
  }
  getTree0(data) {
    let result = {};
    let companyCodeObj = {};
    data.forEach(v => {
      console.log(v);
      v.parentCode = v.parentCode || 'ROOT';
      if (!result[v.parentCode]) {
        result[v.parentCode] = [];
      }
      result[v.parentCode].push({
        title: v.name,
        key: v.code,
        leader: v.leader,
        leaderMobile: v.leadeMobile
      });
      companyCodeObj[v.code] = v.companyCode;
    });
    this.companyCodeObj = companyCodeObj;
    this.result = result;
    let tree = [
      {
        title: this.state.projectName,
        key: this.state.projectCode,
        children: []
      }];
    this.getTreeNode(result['ROOT'], tree[0].children);
    this.setState({ treeData: tree, fetching: false });
  }
  getTreeNode(arr, children) {
    if (arr) {
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
  }
  onSelect = (checkedKeys, event) => {
    console.log(checkedKeys);
    const { treeData } = this.state;
    this.checkNode = '';
    let key = event.node.props.eventKey;
    if (key === this.state.selectKey) {
      this.setState({ selectKey: '' });
    } else {
      this.setState({ selectKey: key });
    }
    if (!this.state.stopGetTree1) {
      // getBumen(key).then(bumenData => {
      //   this.getTree1(bumenData, key);
      // });
    }
  }
  getChildrenKeys(arr, childrenKeys) {
    arr.forEach(a => {
      childrenKeys.push(a.key);
      if (a.children) {
        this.getChildrenKeys(a.children, childrenKeys);
      }
    });
  }
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        // console.log(item.children);
        return (
            <TreeNode title={<div style={{ width: '400px' }}>{item.title}<span style={{ float: 'right' }}>{item.leader}-{item.leaderMobile}</span></div>}
                      key={item.key}
                      dataRef={item}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
        );
      }
      return <TreeNode title={<div style={{ width: '400px' }}>{item.title}<span style={{ float: 'right' }}>{item.leader}-{item.leaderMobile}</span></div>} key={item.key}
                       dataRef={item} />;
    });
  };
  addBumen = () => {
    console.log();
    if(this.state.selectKey[0] === 'D') {
      this.props.history.push(`/newProj/companyConstruct/addBumen?projectCode=${this.code}&upperBumen=${this.state.selectKey}`);
    } else {
      this.props.history.push(`/newProj/companyConstruct/addBumen?projectCode=${this.code}`);
    }
  };
  editBumen = () => {
    console.log(this.state.selectKey[0]);
    if (this.state.selectKey !== '' && this.state.selectKey[0] === 'D') {
      this.props.history.push(`/newProj/companyConstruct/addBumen?code=${this.state.selectKey}&projectCode=${this.code}`);
    } else {
      showWarnMsg('请选择一个部门');
    }
  };
  deleteBumen = () => {
    if (this.state.selectKey !== '' && this.state.selectKey[0] === 'D') {
      Modal.confirm({
        okText: '确认',
        cancelText: '取消',
        content: '确定删除该部门？',
        onOk: () => {
          this.setState({ fetching: true });
          deleteBumen1(this.state.selectKey).then(() => {
            showSucMsg('操作成功');
            this.setState({
              expandedKeys: [],
              checkedKeys: [],
              selectKey: '',
              stopGetTree1: false
            });
            this.reSetData();
          }).catch(this.setState({ fetching: false }));
        }
      });
    } else {
      showWarnMsg('请选择一个部门');
    }
  };
  goBack = () => {
    this.props.history.go(-1);
  };
  render() {
    return this.state.projectName ? (
        <Spin spinning={this.state.fetching}>
          <div className="tools-wrapper" style={{ marginTop: 8 }}>
            <button type="button" className="ant-btn" onClick={this.addBumen}><span>新增部门</span></button>
            <button type="button" className="ant-btn" onClick={this.editBumen}><span>修改部门</span></button>
            <button type="button" className="ant-btn" onClick={this.deleteBumen}><span>删除部门</span></button>
            <button type="button" className="ant-btn" onClick={this.goBack}><span>返回</span></button>
          </div>
          <Form className="detail-form-wrapper" onSubmit={this.handleSubmit}>
            <FormItem key='treeMenu' {...formItemLayout} >
              {this.state.treeData.length ? (
                  <Tree
                      checkable={false}
                      showLine
                      checkStrictly={true}
                      defaultExpandAll
                      autoExpandParent={false}
                      onSelect={this.onSelect}
                      checkedKeys={this.state.checkedKeys}
                  >
                    {this.renderTreeNodes(this.state.treeData)}
                  </Tree>
              ) : null}
            </FormItem>
          </Form>
        </Spin>
    ) : null;
  }
}

export default ProjectAddBumen;
