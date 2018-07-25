import React from 'react';
import cookies from 'browser-cookies';
import { Form, Spin, Button, Tree, Modal } from 'antd';
import { getCompany, getBumen, deleteCompany1, deleteBumen1 } from 'api/company';
import { setRoleMenus } from 'api/user';
import { getQueryString, showSucMsg, showWarnMsg, getUserKind, getUserId } from 'common/js/util';
import { formItemLayout, tailFormItemLayout } from 'common/js/config';

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;

class RoleMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      treeData: [],
      expandedKeys: [],
      autoExpandParent: false,
      checkStrictly: true,
      checkedKeys: [],
      selectKey: '',
      stopGetTree1: false
    };
    this.code = getQueryString('code');
    this.name = getQueryString('name');
  }
  componentDidMount() {
    getCompany().then((companyData) => {
      this.getTree(companyData);
      this.setState({
        fetching: false
      });
    }).catch(() => this.setState({ fetching: false }));
  }
  res = {
    'key': 'company'
  }
  getTree(data) {
    let result = [];
    data.forEach(v => {
      // item.map(v => {
      result.push({
        title: v.name,
        key: v.code
        // });
      });
    });
    this.result = result;
    this.setState({ treeData: this.result });
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
  getTree1(data, companyCode) {
    let result = {};
    let companyCodeObj = {};
    data.forEach(v => {
      v.parentCode = v.parentCode || 'ROOT';
      if (!result[v.parentCode]) {
        result[v.parentCode] = [];
      }
      result[v.parentCode].push({
        title: v.name,
        key: v.code
      });
      companyCodeObj[v.code] = v.companyCode;
    });
    this.companyCodeObj = companyCodeObj;
    this.result = result;
    let tree = [];
    this.getTreeNode(result['ROOT'], tree);
    let oldTree = this.state.treeData;
    oldTree.map(item => {
      if (item.key === companyCode) {
        item.children = tree;
      }
    });
    this.setState({ treeData: oldTree });
    this.setState({ stopGetTree1: true });
  }
  onSelect = (checkedKeys, event) => {
    const { treeData } = this.state;
    this.checkNode = '';
    let key = event.node.props.eventKey;
    if (key === this.state.selectKey) {
      this.setState({ selectKey: '' });
    } else {
      this.setState({ selectKey: key });
    }
    getBumen(key).then(bumenData => {
      this.getTree1(bumenData, key);
    });
  }
  findCheckItem(arr, key) {
    if (this.findCheckItem[key]) {
      this.checkNode = this.findCheckItem[key];
      return;
    }
    for (let i = 0; i < arr.length; i++) {
      if (this.checkNode) {
        return;
      }
      if (arr[i].key === key) {
        this.findCheckItem[key] = this.checkNode;
        this.checkNode = arr[i];
        break;
      } else if (arr[i].children) {
        this.findCheckItem(arr[i].children, key);
      }
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
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  }
  addCompany = () => {
    this.props.history.push(`/newId/companyConstruct/addCompany`);
  }
  editCompany = () => {
    if (this.state.selectKey !== '') {
      this.props.history.push(`/newId/companyConstruct/addCompany?code=${this.state.selectKey}`);
    } else {
      showWarnMsg('请选择一家公司');
    }
  }
  deleteCompany = () => {
    if (this.state.selectKey !== '' && this.state.selectKey.slice(0, 1) === 'C') {
      Modal.confirm({
        okText: '确认',
        cancelText: '取消',
        content: '确定删除该公司？',
        onOk: () => {
          this.setState({ fetching: true });
          deleteCompany1(this.state.selectKey).then(() => {
            showSucMsg('操作成功');
            getCompany().then((companyData) => {
              this.getTree(companyData);
              this.setState({
                fetching: false
              });
            }).catch(() => this.setState({ fetching: false }));
            this.setState({ fetching: false });
          }).catch(() => this.setState({ fetching: false }));
        }
      });
    } else {
      showWarnMsg('请选择一家公司');
    }
  }
  render() {
    const loop = data => data.map((item) => {
      if (item.children) {
        return <TreeNode title={item.name} key={item.key}>{loop(item.children)}</TreeNode>;
      }
      return <TreeNode title={item.name} key={item.key} isLeaf={item.isLeaf} disabled={item.key === '0-0-0'} />;
    });
    const treeNodes = loop(this.state.treeData);
    return (
      <Spin spinning={this.state.fetching}>
        {getUserKind === 'S' ? null
          : <div className="tools-wrapper" style={{ marginTop: 8 }}>
            <button type="button" className="ant-btn" onClick={this.addCompany}><span>新增公司</span></button>
            <button type="button" className="ant-btn" onClick={this.editCompany}><span>修改公司</span></button>
            <button type="button" className="ant-btn" onClick={this.deleteCompany}><span>删除公司</span></button>
          </div>
        }
        <Form className="detail-form-wrapper" onSubmit={this.handleSubmit}>
          <FormItem key='treeMenu' {...formItemLayout} >
            {this.state.treeData.length ? (
              <Tree
                checkable={false}
                showLine
                checkStrictly={this.state.checkStrictly}
                defaultExpandAll
                autoExpandParent={this.state.autoExpandParent}
                onSelect={this.onSelect}
                checkedKeys={this.state.checkedKeys}
              >
                {this.renderTreeNodes(this.state.treeData)}
              </Tree>
            ) : null}
          </FormItem>
        </Form>
      </Spin>
    );
  }
}

export default RoleMenu;
