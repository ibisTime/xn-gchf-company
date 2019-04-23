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
} from '@redux/biz/project/inout';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, getUserId, showSucMsg, showErrMsg } from 'common/js/util';
import { showUploadConfirm } from '../../util';
import fetch from 'common/js/fetch';

@listWrapper(
    state => ({
      ...state.projectInout,
      parentCode: state.menu.subMenuCode
    }),
    { setTableData, clearSearchParam, doFetching, setBtnList,
      cancelFetching, setPagination, setSearchParam, setSearchData }
)
class ProjectInout extends React.Component {
  render() {
    const fields = [{
      title: '人员名称',
      field: 'workerName',
      search: true
    }, {
      title: '证件号',
      field: 'idcardNumber'
    }, {
      title: '进退场日期',
      field: 'date',
      type: 'date'
    }, {
      title: '类型',
      field: 'type',
      type: 'select',
      key: 'entry_exit_type'
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
        uploadStatus: '2',
        userId: getUserId()
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
      pageCode: 631745,
      deleteCode: 631731,
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
              this.props.doFetching, this.props.cancelFetching, 631734);
          }
        },
        // 导入
        import: (keys, items) => {
          this.props.history.push('/project/inout/import');
        },
        edit: (keys, items) => {
          if (!keys.length) {
            showWarnMsg('请选择记录');
          } else if (keys.length > 1) {
            showWarnMsg('请选择一条记录');
          } else if (items[0].uploadStatus === '2') {
            showWarnMsg('已上传不可修改');
          } else {
            this.props.history.push(`/project/inout/addedit?code=${keys[0]}`);
          }
        },
        // 批量删除
        delete: (keys) => {
          if (!keys.length) {
            showWarnMsg('请选择记录');
          } else {
            fetch('631731', { codeList: keys, userId: getUserId() }).then(() => {
              showSucMsg('操作成功');
              setTimeout(() => {
                this.props.getPageData();
              }, 1.5);
            }, () => {
              showErrMsg('操作失败');
            });
          }
        }
      }
    });
  }
}

export default ProjectInout;
