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
} from '@redux/biz/project/class';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, getUserId } from 'common/js/util';
import { showUploadConfirm } from '../../util';

@listWrapper(
    state => ({
      ...state.projectClass,
      parentCode: state.menu.subMenuCode
    }),
    { setTableData, clearSearchParam, doFetching, setBtnList,
      cancelFetching, setPagination, setSearchParam, setSearchData }
)
class ProjectClass extends React.Component {
  render() {
    const fields = [{
      title: '班组名称',
      field: 'teamName',
      search: true
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
      title: '责任人姓名',
      field: 'responsiblePersonName'
    }, {
      title: '责任人联系电话',
      field: 'responsiblePersonPhone'
    }, {
      title: '进场时间',
      field: 'entryTime',
      type: 'datetime'
    }, {
      title: '退场时间',
      field: 'exitTime',
      type: 'datetime'
    }, {
      title: '备注',
      field: 'remark',
      type: 'textarea',
      normalArea: true
    }, {
      title: '状态',
      field: 'uploadStatus',
      type: 'select',
      key: 'upload_status',
      search: true
    }];
    return this.props.buildList({
      fields,
      pageCode: 631665,
      deleteCode: 631651,
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
              this.props.doFetching, this.props.cancelFetching, 631654);
          }
        },
        // 导入
        import: (keys, items) => {
          this.props.history.push('/project/class/import');
        },
        edit: (keys, items) => {
          if (!keys.length) {
            showWarnMsg('请选择记录');
          } else if (keys.length > 1) {
            showWarnMsg('请选择一条记录');
          } else if (items[0].uploadStatus === '2') {
            showWarnMsg('已上传不可修改');
          } else {
            this.props.history.push(`/project/class/addedit?code=${keys[0]}`);
          }
        }
      }
    });
  }
}

export default ProjectClass;
