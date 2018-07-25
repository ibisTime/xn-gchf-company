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
} from '@redux/people/history';
import { listWrapper } from 'common/js/build-list';
import { getQueryString, showWarnMsg, showSucMsg, getUserKind, getUserId } from 'common/js/util';
import { getUserDetail } from 'api/user';

@listWrapper(
  state => ({
    ...state.peopleHistory,
    parentCode: state.menu.subMenuCode
  }),
  { setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData }
)
class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyCode: ''
    };
    if(getUserKind() === 'O') {
      getUserDetail(getUserId()).then((data) => {
        this.setState({'companyCode': data.companyCode});
      });
    }
    this.projectCode = getQueryString('code', this.props.location.search);
  }
  render() {
    const fieldso = [{
      field: 'projectCode',
      title: '项目编号',
      value: this.projectCode,
      hidden: true
    }, {
      field: 'staffCode',
      title: '员工',
      type: 'select',
      listCode: '631406',
      params: {
        projectCode: this.projectCode,
        updater: '',
        companyCode: '',
        kind: 'O'
      },
      keyName: 'staffCode',
      valueName: 'staffCode',
      required: true
    }, {
      field: 'type',
      title: '员工类别',
      type: 'select',
      key: 'staff_type',
      required: true
    }, {
      field: 'position',
      title: '职位',
      required: true
    }, {
      field: 'salary',
      title: '薪酬',
      required: true
    }, {
      field: 'joinDatetime',
      title: '入职时间',
      type: 'date',
      required: true
    }, {
      field: 'upUser',
      title: '上级'
    }, {
      field: 'remark',
      title: '备注'
    }];
    const fields = [{
      field: 'projectCode',
      title: '项目编号',
      value: this.projectCode,
      hidden: true
    }, {
      field: 'staffCode',
      title: '员工',
      type: 'select',
      listCode: '631406',
      params: {
        projectCode: this.projectCode,
        updater: ''
      },
      keyName: 'staffCode',
      valueName: 'staffCode',
      required: true
    }, {
      field: 'type',
      title: '员工类别',
      type: 'select',
      key: 'staff_type',
      required: true
    }, {
      field: 'position',
      title: '职位',
      required: true
    }, {
      field: 'salary',
      title: '薪酬',
      required: true
    }, {
      field: 'joinDatetime',
      title: '入职时间',
      type: 'date',
      required: true
    }, {
      field: 'upUser',
      title: '上级'
    }, {
      field: 'remark',
      title: '备注'
    }];
    if(getUserKind() === 'O') {
      return this.state.companyCode ? this.props.buildList({
        fields,
        searchParams: { projectCode: this.projectCode, updater: '' },
        pageCode: 631465,
        rowKey: 'staffCode',
        buttons: [{
          code: 'break',
          name: '请假',
          handler: (selectedRowKeys, selectedRows) => {
            if (!selectedRowKeys.length) {
              showWarnMsg('请选择记录');
            } else if (selectedRowKeys.length > 1) {
              showWarnMsg('请选择一条记录');
            } else {
              this.props.history.push(`/people/wugong/break?code1=${selectedRows[0].code}`);
            }
          }
        }, {
          code: 'leave',
          name: '离职',
          handler: (selectedRowKeys, selectedRows) => {
            if (!selectedRowKeys.length) {
              showWarnMsg('请选择记录');
            } else if (selectedRowKeys.length > 1) {
              showWarnMsg('请选择一条记录');
            } else {
              this.props.history.push(`/people/wugong/leave?code1=${selectedRows[0].code}`);
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
              this.props.history.push(`/people/wugong/addedit?v=1&staffCode=${selectedRowKeys[0]}&projectCode=${this.projectCode}`);
            }
          }
        }]
      }) : null;
    }else {
      return this.props.buildList({
        fields,
        searchParams: { projectCode: this.projectCode, updater: '' },
        pageCode: 631465,
        rowKey: 'staffCode',
        buttons: [{
          code: 'break',
          name: '请假',
          handler: (selectedRowKeys, selectedRows) => {
            if (!selectedRowKeys.length) {
              showWarnMsg('请选择记录');
            } else if (selectedRowKeys.length > 1) {
              showWarnMsg('请选择一条记录');
            } else {
              this.props.history.push(`/people/wugong/break?code1=${selectedRows[0].code}`);
            }
          }
        }, {
          code: 'leave',
          name: '离职',
          handler: (selectedRowKeys, selectedRows) => {
            if (!selectedRowKeys.length) {
              showWarnMsg('请选择记录');
            } else if (selectedRowKeys.length > 1) {
              showWarnMsg('请选择一条记录');
            } else {
              this.props.history.push(`/people/wugong/leave?code1=${selectedRows[0].code}`);
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
              this.props.history.push(`/people/wugong/addedit?v=1&staffCode=${selectedRowKeys[0]}&projectCode=${this.projectCode}`);
            }
          }
        }]
      });
    }
  }
}

export default History;
