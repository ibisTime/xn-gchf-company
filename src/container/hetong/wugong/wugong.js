import React from 'react';
import cookies from 'browser-cookies';
import {
  setTableData,
  setPagination,
  setBtnList,
  setSearchParam,
  clearSearchParam,
  doFetching,
  cancelFetching,
  setSearchData
} from '@redux/hetong/wugong';
import { listWrapper } from 'common/js/build-list';
import { getQueryString, showWarnMsg, showSucMsg, getUserKind, getUserId } from 'common/js/util';
import { getUserDetail } from 'api/user';

@listWrapper(
  state => ({
    ...state.hetongWugong,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class Wugong extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectCode: ''
    };
  }
  componentDidMount() {
    getUserDetail(getUserId()).then((data) => {
      this.setState({ projectCode: data.projectCode, projectCodeList: data.projectCodeList });
    });
  }
  render() {
    const fields = [{
      field: 'projectCode',
      title: '工程名称',
      type: 'select',
      listCode: '631357',
      params: {
        companyCode: this.state.companyCode,
        kind: 'O',
        updater: ''
      },
      keyName: 'code',
      valueName: 'name'
    }, {
      field: 'staffName',
      title: '工人姓名'
    }, {
      field: 'staffMobile',
      title: '手机号'
    }, {
      field: 'contractDatetime',
      title: '签约时间',
      type: 'date'
    }, {
      field: 'remark',
      title: '备注'
    }, {
      field: 'keyword',
      title: '关键字查询',
      placeholder: '手机号模糊查询',
      hidden: true,
      search: true
    }];
    return this.state.projectCode ? this.props.buildList({
      fields,
      searchParams: {
        projectCodeList: this.state.projectCodeList,
        projectCode: this.state.projectCode
      },
      buttons: [{
        code: 'add',
        name: '新增',
        handler: (selectedRowKeys, selectedRows) => {
          this.props.history.push(`/hetong/wugong/addedit`);
        }
      }, {
        code: 'edit',
        name: '修改',
        handler: (selectedRowKeys, selectedRows) => {
          if (!selectedRowKeys.length) {
            showWarnMsg('请选择记录');
          } else if (selectedRowKeys.length > 1) {
            showWarnMsg('请选择一条记录');
          } else {
            this.props.history.push(`/hetong/wugong/edit?code=${selectedRowKeys[0]}`);
          }
        }
      }, {
        code: 'detail',
        name: '详情',
        handler: (selectedRowKeys, selectedRows) => {
          if (!selectedRowKeys.length) {
            showWarnMsg('请选择记录');
          } else if (selectedRowKeys.length > 1) {
            showWarnMsg('请选择一条记录');
          } else {
            this.props.history.push(`/hetong/wugong/edit?v=1&code=${selectedRowKeys[0]}`);
          }
        }
      }],
      pageCode: 631405
    }) : null;
  }
}

export default Wugong;
