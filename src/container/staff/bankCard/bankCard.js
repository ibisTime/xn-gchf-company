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
} from '@redux/staff/bankCard';
import { listWrapper } from 'common/js/build-list';
import { getUserId, getUserKind, showWarnMsg } from 'common/js/util';
import { getUserDetail } from 'api/user';

@listWrapper(
  state => ({
    ...state.staffBankCard,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class BankCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectCodeList: '',
      projectCode: ''
    };
  }
  componentDidMount() {
    getUserDetail(getUserId()).then((data) => {
      this.setState({ 'projectCode': data.projectCode });
    });
  }
  render() {
    const fields = [{
      field: 'staffCode',
      title: '员工编号',
      hidden: true
    }, {
      field: 'staffName',
      title: '真实姓名'
    }, {
      field: 'projectName',
      title: '项目名称'
    }, {
      field: 'bankSubbranchName',
      title: '开户行'
    }, {
      field: 'bankcardNumber',
      title: '银行账号'
    }, {
      field: 'remark',
      title: '备注'
    }, {
      field: 'keyword',
      title: '关键字',
      placeholder: '银行/姓名/卡号',
      search: true,
      hidden: true
    }];
    const btnEvent = {
      edit: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/staff/bankCard/edit?code=${selectedRowKeys[0]}&staffCode=${selectedRows[0].staffCode}&name=${selectedRows[0].staffName}`);
        }
      }
    };
    return this.state.projectCode ? this.props.buildList({
      fields,
      btnEvent,
      pageCode: 631425,
      searchParams: {
        projectCode: this.state.projectCode
      }
    }) : null;
  }
}

export default BankCard;