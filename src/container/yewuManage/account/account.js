import React from 'react';
import cookies from 'browser-cookies';
import {
  setTableData,
  setPagination,
  setBtnList,
  setSearchParam,
  clearSearchParam,
  doFetching,
  cancelFetching,
  setSearchData
} from '@redux/yewuManage/account';
import { listWrapper } from 'common/js/build-list';
import { getUserDetail } from 'api/user';
import { getUserKind, getUserId } from 'common/js/util';

@listWrapper(
  state => ({
    ...state.yewuManageAccount,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectCode: ''
    };
  }
  componentDidMount() {
    getUserDetail(getUserId()).then((data) => {
      this.setState({ 'projectCode': data.projectCode });
    });
  }
  render() {
    const fieldso = [{
      field: 'projectCode',
      title: '工程编号',
      hidden: true
    }, {
      field: 'projectCode',
      title: '工程名称',
      type: 'select',
      listCode: '631357',
      params: {
        updater: '',
        companyCode: this.state.companyCode,
        kind: 'O'
      },
      keyName: 'code',
      valueName: 'name'
    }, {
      field: 'bankNames',
      title: '开户行',
      formatter: (v, d) => {
        return d.bankName + d.subbranch;
      }
    }, {
      field: 'bankCode',
      title: '银行类别',
      hidden: true
    }, {
      field: 'bankcardNumber',
      title: '银行账户'
    }, {
      field: 'status',
      title: '状态',
      key: 'account_status',
      type: 'select'
    }, {
      field: 'createDatetime',
      title: '创建时间',
      type: 'datetime'
    }, {
      field: 'keyword',
      title: '关键字',
      placeholder: '户名/银行/关联工程',
      search: true,
      hidden: true
    }];
    return this.state.projectCode ? this.props.buildList({
      fields: fieldso,
      pageCode: 631365,
      searchParams: {
        projectCode: this.state.projectCode
      }
    }) : null;
  }
}

export default Account;
