import React from 'react';
import moment from 'moment';
import {
  setTableData,
  setPagination,
  setBtnList,
  setSearchParam,
  clearSearchParam,
  doFetching,
  cancelFetching,
  setSearchData
} from '@redux/biz/project/wages';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, monthFormat, getUserId } from 'common/js/util';
import { showUploadConfirm } from '../../util';

@listWrapper(
    state => ({
      ...state.projectWages,
      parentCode: state.menu.subMenuCode
    }),
    { setTableData, clearSearchParam, doFetching, setBtnList,
      cancelFetching, setPagination, setSearchParam, setSearchData }
)
class ProjectWages extends React.Component {
  render() {
    const fields = [{
      title: '工人姓名',
      field: 'workerName',
      search: true
    }, {
      title: '证件号',
      field: 'idcardNumber'
    }, {
      title: '发放工资的月份',
      field: 'payMonth',
      type: 'month',
      render: (v, d) => d ? monthFormat(d.balanceDate) : '',
      search: true
    }, {
      title: '出勤天数',
      field: 'days'
    }, {
      title: '总工时',
      field: 'workHours'
    }, {
      title: '应发金额',
      field: 'totalPayAmount',
      amount: true
    }, {
      title: '实发金额',
      field: 'actualAmount',
      amount: true
    }, {
      title: '是否为补发',
      field: 'isBackPay',
      type: 'select',
      key: 'is_not'
    }, {
      title: '对应项目',
      field: 'projectName'
    }, {
      title: '所在企业',
      field: 'corpCode',
      pageCode: '631255',
      params: {
        uploadStatus: '2'
      },
      keyName: 'corpCode',
      valueName: 'corpName',
      type: 'select',
      hidden: true,
      search: true
    }, {
      title: '所在企业',
      field: 'corpName'
    }, {
      title: '所在班组',
      field: 'teamName'
    }, {
      title: '状态',
      field: 'uploadStatus',
      type: 'select',
      key: 'upload_status',
      search: true
    }];
    return this.props.buildList({
      fields,
      pageCode: 631815,
      deleteCode: 631811,
      searchParams: {
        userId: getUserId()
      },
      singleSelect: false,
      beforeDelete: (params) => {
        params.userId = getUserId();
      },
      btnEvent: {
        // 上传平台
        up: (keys, items) => {
          if (!keys.length) {
            showWarnMsg('请选择记录');
          } else {
            showUploadConfirm(keys, items, this.props.getPageData,
              this.props.doFetching, this.props.cancelFetching, 631813);
          }
        },
        // 导入
        import: (keys, items) => {
          this.props.history.push('/project/wages/import');
        },
        add: () => this.props.history.push('/project/wages/add'),
        edit: (keys, items) => {
          if (!keys.length) {
            showWarnMsg('请选择记录');
          } else if (keys.length > 1) {
            showWarnMsg('请选择一条记录');
          } else if (items[0].uploadStatus === '2') {
            showWarnMsg('已上传不可修改');
          } else {
            this.props.history.push(`/project/wages/addedit?code=${keys[0]}`);
          }
        }
      }
    });
  }
}

export default ProjectWages;
