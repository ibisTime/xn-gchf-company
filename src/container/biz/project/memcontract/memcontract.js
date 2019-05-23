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
import { showWarnMsg, dateFormat, getUserId, isUndefined, showSucMsg, showErrMsg } from 'common/js/util';
import { showUploadConfirm } from '../../util';
import fetch from 'common/js/fetch';
import { Modal } from 'antd';

const confirm = Modal.confirm;

@listWrapper(
    state => ({
      ...state.projectMemContract,
      parentCode: state.menu.subMenuCode
    }),
    { setTableData, clearSearchParam, doFetching, setBtnList,
      cancelFetching, setPagination, setSearchParam, setSearchData }
)
class ProjectMemContract extends React.Component {
  state = {
    uploadStatusData: []
  };
  componentWillMount() {
    fetch(631006, {
      parentKey: 'upload_status'
    }).then(data => {
      let uploadStatusData = [];
      data.forEach((item) => {
        if(item.dkey !== '1' && item.dkey !== '2' && item.dkey !== '5') {
          uploadStatusData.push({
            dkey: item.dkey,
            dvalue: item.dvalue
          });
        }
      });
      this.setState({
        uploadStatusData
      });
    });
  }
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
      title: '所在企业',
      field: 'corpName',
      search: true
    }, {
      title: '状态',
      field: 'uploadStatus',
      type: 'select',
      data: this.state.uploadStatusData,
      keyName: 'dkey',
      valueName: 'dvalue',
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
          } else if (items[0].uploadStatus === '3') {
            showWarnMsg('已上传不可修改');
          } else if (items[0].uploadStatus === '4' || items[0].uploadStatus === '5') {
            showWarnMsg('该状态下不可修改');
          } else {
            this.props.history.push(`/project/memcontract/addedit?code=${keys[0]}`);
          }
        },
        // 批量删除
        delete: (keys) => {
          const _this = this;
          if (!keys.length) {
            showWarnMsg('请选择记录');
          } else {
            confirm({
              title: '删除',
              content: '是否删除？',
              onOk() {
                fetch('631671', { codeList: keys, userId: getUserId() }).then(() => {
                  showSucMsg('操作成功');
                  setTimeout(() => {
                    _this.props.getPageData();
                  }, 1000);
                });
              },
              onCancel() {
              },
              okText: '确定',
              cancelText: '取消'
            });
          }
        }
      }
    });
  }
}

export default ProjectMemContract;
