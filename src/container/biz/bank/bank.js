import React from 'react';
import { Modal } from 'antd';
import {
  setTableData,
  setPagination,
  setBtnList,
  setSearchParam,
  clearSearchParam,
  doFetching,
  cancelFetching,
  setSearchData
} from '@redux/biz/bank';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, showSucMsg, getUserId, getQueryString } from 'common/js/util';
import { getProjectList } from 'api/general';
import fetch from 'common/js/fetch';

@listWrapper(
    state => ({
      ...state.bizBank,
      parentCode: state.menu.subMenuCode
    }),
    { setTableData, clearSearchParam, doFetching, setBtnList,
      cancelFetching, setPagination, setSearchParam, setSearchData }
)
class Bank extends React.Component {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
    this.type = getQueryString('type', this.props.location.search);
    this.buttons = [{
      code: 'add',
      name: '新增',
      handler: () => {
        this.props.history.push(`${this.props.location.pathname}/addedit?bcode=${this.code}&type=${this.type}`);
      }
    }, {
      code: 'edit',
      name: '修改',
      handler: (keys, items) => {
        if (!keys.length) {
          showWarnMsg('请选择记录');
        } else if (keys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`${this.props.location.pathname}/addedit?bcode=${this.code}&code=${keys[0]}&type=${items[0].businessType}`);
        }
      }
    }, {
      code: 'up',
      name: '启用',
      handler: (keys, items) => {
        this.upDownRecord(keys, items, true);
      }
    }, {
      code: 'down',
      name: '弃用',
      handler: (keys, items) => {
        this.upDownRecord(keys, items);
      }
    }, {
      code: 'detail',
      name: '详情',
      handler: (keys, items) => {
        if (!keys.length) {
          showWarnMsg('请选择记录');
        } else if (keys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`${this.props.location.pathname}/addedit?bcode=${this.code}&v=1&code=${keys[0]}&type=${this.type}`);
        }
      }
    }, {
      code: 'back',
      name: '返回',
      handler: () => this.props.history.go(-1)
    }];
    this.btnEvent = {
      add: () => this.props.history.push(`${this.props.location.pathname}/addedit?type=002`),
      edit: (keys, items) => {
        if (!keys.length) {
          showWarnMsg('请选择记录');
        } else if (keys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`${this.props.location.pathname}/addedit?code=${keys[0]}&type=${items[0].businessType}`);
        }
      },
      up: (keys, items) => {
        this.upDownRecord(keys, items, true);
      },
      down: (keys, items) => {
        this.upDownRecord(keys, items);
      }
    };
  }
  upDownRecord(keys, items, up) {
    let status = up ? '1' : '0';
    let tip = up ? '启用' : '弃用';
    if (!keys.length) {
      showWarnMsg('请选择记录');
    } else if (keys.length > 1) {
      showWarnMsg('请选择一条记录');
    } else if (items[0].status != status) {
      showWarnMsg('该记录已经' + tip);
    } else {
      Modal.confirm({
        okType: 'primary',
        title: '您确定要' + tip + '该银行卡吗?',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.props.doFetching();
          fetch(631751, {
            code: keys[0],
            userId: getUserId()
          }).then(() => {
            showSucMsg('操作成功');
            this.props.getPageData();
          }).catch(this.props.cancelFetching);
        }
      });
    }
  }
  render() {
    const fields = [{
      title: '银行支行名称',
      field: 'bankName'
    }, {
      title: '银行卡号',
      field: 'bankNumber'
    }, {
      title: '银行联号',
      field: 'bankLinkNumber'
    }, {
      title: '创建时间',
      field: 'createDatetime',
      type: 'datetime'
    }, {
      title: '状态',
      field: 'status',
      type: 'select',
      key: 'bankcard_status',
      search: true
    }];
    let config = {
      fields,
      pageCode: 631765,
      searchParams: {
        userId: getUserId()
      },
      beforeDetail: (params) => {
        params.userId = getUserId();
        if (this.code) {
          params.businessSysNo = this.code;
        } else {
          params.businessType = '002';
        }
      }
    };
    // 说明从参建单位过来的
    if (this.code) {
      config.buttons = this.buttons;
    } else {
      config.btnEvent = this.btnEvent;
    }
    return this.props.buildList(config);
  }
}

export default Bank;
