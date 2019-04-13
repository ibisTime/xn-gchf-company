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
} from '@redux/biz/project/memcontract';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, dateFormat, getUserId, isUndefined } from 'common/js/util';
import { showUploadConfirm } from '../../util';

@listWrapper(
    state => ({
      ...state.projectMemContract,
      parentCode: state.menu.subMenuCode
    }),
    { setTableData, clearSearchParam, doFetching, setBtnList,
      cancelFetching, setPagination, setSearchParam, setSearchData }
)
class ProjectMemContract extends React.Component {
  render() {
    const fields = [{
      title: '工人姓名',
      field: 'workerName',
      search: true
    }, {
      title: '证件号',
      field: 'idcardNumber'
    }, {
      title: '合同期限类型',
      field: 'contractPeriodType',
      type: 'select',
      key: 'contract_period_type'
    }, {
      title: '期限',
      field: 'startDate',
      render: (v, d) => {
        return d ? dateFormat(d.startDate) + '~' + dateFormat(d.endDate) : '';
      }
    }, {
      title: '计量',
      field: 'unit',
      type: 'select',
      key: 'unit',
      render: (v, data) => {
        if (data && this.props.searchData.unit) {
          let item = this.props.searchData.unit.find(s => s.dkey == v);
          let unit = item ? item.dvalue : '';
          let unitPrice = isUndefined(data.unitPrice) ? '' : data.unitPrice;
          return unitPrice + '/' + unit;
        }
        return '';
      }
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
      title: '状态',
      field: 'uploadStatus',
      type: 'select',
      key: 'upload_status',
      search: true
    }];
    return this.props.buildList({
      fields,
      pageCode: 631685,
      deleteCode: 631671,
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
              this.props.doFetching, this.props.cancelFetching, 631674);
          }
        },
        // 导入
        import: (keys, items) => {
          this.props.history.push('/project/memcontract/import');
        },
        edit: (keys, items) => {
          if (!keys.length) {
            showWarnMsg('请选择记录');
          } else if (keys.length > 1) {
            showWarnMsg('请选择一条记录');
          } else if (items[0].uploadStatus === '2') {
            showWarnMsg('已上传不可修改');
          } else {
            this.props.history.push(`/project/memcontract/addedit?code=${keys[0]}`);
          }
        }
      }
    });
  }
}

export default ProjectMemContract;
