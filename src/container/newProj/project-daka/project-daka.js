import React from 'react';
import fetch from 'common/js/fetch';
import {
  setTableData,
  setPagination,
  setBtnList,
  setSearchParam,
  clearSearchParam,
  doFetching,
  cancelFetching,
  setSearchData
} from '@redux/newProj/project-daka';
import { listWrapper } from 'common/js/build-list';
import { getQueryString, showWarnMsg, showSucMsg, dateTimeFormat } from 'common/js/util';
import { Modal } from 'antd';

@listWrapper(
  state => ({
    ...state.newProjProjectDaka,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class Daka extends React.Component {
  constructor(props) {
    super(props);
    this.projectCode = getQueryString('projectCode', this.props.location.search);
    this.dateTime = dateTimeFormat(new Date());
    console.log(this.dateTime);
    this.dateStart = this.dateTime.split(' ')[0] + ' ' + '00:00:00';
    this.dateEnd = this.dateTime.split(' ')[0] + ' ' + '23:59:59';
  }
  render() {
    const fields = [{
      field: 'projectName',
      title: '项目名称'
    }, {
      field: 'staffName',
      title: '员工姓名'
    }, {
      field: 'staffMobile',
      title: '员工手机号'
    }, {
      field: 'startDatetime',
      title: '上班时间'
    }, {
      field: 'endDatetime',
      title: '下班时间'
    }, {
      field: 'status',
      title: '状态',
      type: 'select',
      search: true,
      key: 'attendance_status'
    }, {
      field: 'remark',
      title: '备注'
    }, {
      field: 'keyword',
      title: '关键字',
      search: true,
      hidden: true
    }];
    return this.props.buildList({
      fields,
      searchParams: { dateStart: this.dateStart, dateEnd: this.dateEnd, projectCode: this.projectCode },
      pageCode: 631395,
      rowKey: 'code',
      buttons: [{
        code: 'daka',
        name: '打卡',
        handler: (selectedRowKeys, selectedRows) => {
          if (!selectedRowKeys.length) {
            showWarnMsg('请选择记录');
          } else if (selectedRowKeys.length > 1) {
            showWarnMsg('请选择一条记录');
          } else {
            Modal.confirm({
              okText: '确认',
              cancelText: '取消',
              content: '确定打卡？',
              onOk: () => {
                this.props.doFetching();
                fetch(631390, { projectCode: this.projectCode, staffCode: selectedRows[0].staffCode }).then(() => {
                  showSucMsg('操作成功');
                  this.props.cancelFetching();
                  setTableData();
                }).catch(this.props.cancelFetching);
              }
            });
          }
        }
      }]
    });
  }
}

export default Daka;
