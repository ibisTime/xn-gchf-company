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
} from '@redux/biz/project/attence';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, getUserId } from 'common/js/util';
import { showUploadConfirm } from '../../util';

@listWrapper(
    state => ({
      ...state.projectAttence,
      parentCode: state.menu.subMenuCode
    }),
    { setTableData, clearSearchParam, doFetching, setBtnList,
      cancelFetching, setPagination, setSearchParam, setSearchData }
)
class ProjectAttence extends React.Component {
  render() {
    const fields = [{
      title: '工人姓名',
      field: 'workerName',
      search: true
    }, {
      title: '证件号',
      field: 'idCardNumber'
    }, {
      title: '刷卡时间',
      field: 'date',
      type: 'datetime'
    }, {
      title: '刷卡进出方向',
      field: 'direction',
      type: 'select',
      key: 'direction'
    }, {
      title: '对应项目',
      field: 'projectName'
    }, {
      title: '所在企业',
      field: 'corpName'
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
      pageCode: 631725,
      deleteCode: 631711,
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
              this.props.doFetching, this.props.cancelFetching, 631714);
          }
        },
        // 导入
        import: (keys, items) => {
          this.props.history.push('/project/attence/import');
        },
        edit: (keys, items) => {
          if (!keys.length) {
            showWarnMsg('请选择记录');
          } else if (keys.length > 1) {
            showWarnMsg('请选择一条记录');
          } else if (items[0].uploadStatus === '2') {
            showWarnMsg('已上传不可修改');
          } else {
            this.props.history.push(`/project/attence/addedit?code=${keys[0]}`);
          }
        }
      }
    });
  }
}

export default ProjectAttence;
