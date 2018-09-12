import React from 'react';
import fetch from 'common/js/fetch';
import XLSX from 'xlsx';
import {
  setTableData,
  setPagination,
  setBtnList,
  setSearchParam,
  clearSearchParam,
  doFetching,
  cancelFetching,
  setSearchData
} from '@redux/staff/allStaff-leaveRecords';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, showSucMsg, getUserKind, getUserId, formatDate, getQueryString, dateTimeFormat } from 'common/js/util';
import { getUserDetail } from 'api/user';

@listWrapper(
  state => ({
    ...state.staffAllStaffLeaveRecords,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class AllStaffLeaveRecords extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageCode: null,
      searchParams: null,
      projectCode: ''
    };
  }
  componentDidMount() {
    getUserDetail(getUserId()).then((data) => {
      this.setState({ 'projectCode': data.projectCode });
    });
  }
  render() {
    const fields = [{
      field: 'staffName',
      title: '姓名'
    }, {
      field: 'startDatetime',
      title: '请假时间',
      type: 'date'
    }, {
      field: 'endDatetime',
      title: '销假时间',
      type: 'date'
    }, {
      field: 'leaveDays',
      title: '请假天数'
    }, {
      field: 'updateDatetime',
      title: '更新时间',
      type: 'datetime'
    }, {
      field: 'keyword',
      title: '关键字查询',
      search: true,
      hidden: true,
      placeholder: '姓名'
    }, {
      field: 'departmentCode',
      placeholder: '部门',
      listCode: '631036',
      params: {
        projectCode: this.state.projectCode
      },
      keyName: 'code',
      valueName: 'name',
      type: 'select',
      search: true,
      hidden: true
    }, {
      field: 'position',
      placeholder: '职位',
      type: 'select',
      data: [{
        dkey: '0',
        dvalue: '普工'
      }, {
        dkey: '1',
        dvalue: '主管'
      }],
      keyName: 'dkey',
      valueName: 'dvalue',
      search: true,
      hidden: true
    }, {
      field: 'employStatus',
      placeholder: '状态',
      key: 'staff_status',
      search: true,
      type: 'select',
      hidden: true
    }];
    return this.state.projectCode ? this.props.buildList({
      fields,
      buttons: [{
        code: 'export',
        name: '导出',
        handler: (selectedRowKeys, selectedRows) => {
          fetch(631468, {projectCode: this.state.projectCode, limit: 10000, start: 1}).then((data) => {
            let tableData = [];
            let title = [];
            fields.map((item) => {
              if (item.title !== '关键字查询' && item.title !== '部门' && item.title !== '职位' && item.title !== '状态') {
                title.push(item.title);
              }
            });
            tableData.push(title);
            data.list.map((item) => {
              let temp = [];
              temp.push(
                  item.staffName,
                  item.startDatetime ? formatDate(item.startDatetime) : '',
                  item.endDatetime ? formatDate(item.endDatetime) : '',
                  item.leaveDays,
                  item.updateDatetime ? dateTimeFormat(item.updateDatetime) : ''
              );
              tableData.push(temp);
            });
            const ws = XLSX.utils.aoa_to_sheet(tableData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
            XLSX.writeFile(wb, '请假明细.xlsx');
          });
        }
      }],
      searchParams: {
        projectCode: this.state.projectCode
      },
      pageCode: 631468
    }) : null;
  }
}

export default AllStaffLeaveRecords;
