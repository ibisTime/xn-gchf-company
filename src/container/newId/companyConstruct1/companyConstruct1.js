import React from 'react';
import cookies from 'browser-cookies';
import { rock } from 'api/user';
import { getCompany, deleteCompany1 } from 'api/company';
import { Modal } from 'antd';
import {
  setTableData,
  setPagination,
  setBtnList,
  setSearchParam,
  clearSearchParam,
  doFetching,
  cancelFetching,
  setSearchData
} from '@redux/newId/companyConstruct1';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, showSucMsg } from 'common/js/util';

@listWrapper(
  state => ({
    ...state.newIdCompanyConstruct1,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class CompanyConstruct1 extends React.Component {
  render() {
    const fields = [{
      title: '公司名称',
      field: 'name'
    }, {
      title: '创建时间',
      field: 'createDatetime',
      type: 'datetime'
    }];
    return this.props.buildList({
      fields,
      buttons: [{
        name: '新增公司',
        code: 'add',
        handler: () => {
          this.props.history.push(`/newId/companyConstruct/addCompany`);
        }
      }, {
        name: '修改公司',
        code: 'edit',
        handler: (selectedRowKeys, selectedRows) => {
          if (!selectedRowKeys.length) {
            showWarnMsg('请选择记录');
          } else if (selectedRowKeys.length > 1) {
            showWarnMsg('请选择一条记录');
          } else {
            this.props.history.push(`/newId/companyConstruct/addCompany?code=${selectedRowKeys}`);
          }
        }
      }, {
        name: '删除公司',
        code: 'delete',
        handler: (selectedRowKeys) => {
          if (!selectedRowKeys.length) {
            showWarnMsg('请选择记录');
          } else if (selectedRowKeys.length > 1) {
            showWarnMsg('请选择一条记录');
          } else {
            Modal.confirm({
              okText: '确认',
              cancelText: '取消',
              content: '确定删除？',
              onOk: () => {
                this.setState({ fetching: true });
                deleteCompany1(selectedRowKeys[0]).then(() => {
                  showSucMsg('操作成功');
                  this.setState({
                    fetching: false
                  });
                  this.setState({ fetching: false });
                  this.props.getPageData();
                }).catch(() => this.setState({ fetching: false }));
              }
            });
          }
        }
      }],
      pageCode: 631025
    });
  }
}

export default CompanyConstruct1;
