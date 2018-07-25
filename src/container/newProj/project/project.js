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
} from '@redux/newProj/project';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, showSucMsg } from 'common/js/util';

@listWrapper(
  state => ({
    ...state.newProjProject,
    parentCode: state.menu.subMenuCode
  }),
  { setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData }
)
class project extends React.Component {
  render() {
    const fields = [{
      field: 'name',
      title: '项目名称'
    }, {
      field: 'address',
      title: '详细地址'
    }, {
      field: 'startDatetime',
      title: '项目开始时间',
      type: 'date'
    }, {
      field: 'endDatetime',
      title: '项目结束时间',
      type: 'date'
    }, {
      field: 'salaryDatetime',
      title: '薪资发放时间'
    }, {
      field: 'status',
      title: '状态',
      type: 'select',
      key: 'project_status'
    }, {
      field: 'updater',
      title: '修改人'
    }, {
      field: 'updateDatetime',
      title: '修改时间',
      type: 'datetime'
    }, {
      field: 'remark',
      title: '备注'
    }];
    const btnEvent = {
      edit: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          if(selectedRows[0].status === '0') {
            this.props.history.push(`/projectManage/project/edit?code=${selectedRowKeys[0].code}`);
          }else {
            showWarnMsg('该状态无法进行审核');
          }
        }
      },
      check: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          if(selectedRows[0].status === '1') {
            this.props.history.push(`/newProj/project/check?v=1&code=${selectedRows[0].code}`);
          }else {
            showWarnMsg('该状态无法进行审核');
          }
        }
      },
      endProject: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          if(selectedRows[0].status !== '3') {
            this.props.history.push(`/newProj/project/end?v=1&code=${selectedRows[0].code}`);
          }else {
            showWarnMsg('该项目已结束');
          }
        }
      }
    };
    return this.props.buildList({ fields, btnEvent, pageCode: 631356, rowKey: 'code' });
  }
}

export default project;
