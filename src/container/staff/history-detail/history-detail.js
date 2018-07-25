import React from 'react';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/staff/history-detail';
import { getQueryString, showSucMsg, getUserKind, getUserId } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { getBankNameByCode, buquanxinxi } from 'api/project';
import { getUserDetail } from 'api/user';
import { moneyFormat } from '../../../common/js/util';

@DetailWrapper(
  state => state.staffHistoryDetail,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class HistoryDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyCode: ''
    };
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }
  componentDidMount() {
    if (getUserKind() === 'S') {
      getUserDetail(getUserId()).then((data) => {
        this.setState({ 'projectCodeList': data.projectCodeList });
      });
    };
    if (getUserKind() === 'O') {
      getUserDetail(getUserId()).then((data) => {
        this.setState({ companyCode: data.companyCode });
      });
    };
  }
  render() {
    const fields = [{
      field: 'staffName',
      title: '姓名'
    }, {
      field: 'idNo',
      title: '证件号',
      formatter: (v, d) => {
        return d.staff.idNo;
      }
    }, {
      field: 'mobile',
      title: '手机号',
      formatter: (v, d) => {
        return d.staff.mobile;
      }
    }, {
      field: 'projectName',
      title: '所在工程'
    }, {
      field: 'departmentName',
      title: '部门'
    }, {
      field: 'position',
      title: '职位'
    }, {
      field: 'salary',
      title: '日薪',
      formatter: moneyFormat
    }, {
      field: 'cutAmount',
      title: '迟到早退每小时扣款金额',
      formatter: moneyFormat
    }, {
      field: 'status',
      title: '状态',
      key: 'staff_status',
      type: 'select'
    }, {
      field: 'remark',
      title: '备注'
    }, {
      field: 'keyword',
      title: '关键字查询',
      placeholder: '名字/手机号',
      hidden: true,
      search: true
    }];
    return this.props.buildDetail({
      fields,
      code: this.code,
      detailCode: 631467,
      view: this.view,
      buttons: [{
        title: '返回',
        handler: (param) => {
          this.props.history.go(-1);
        }
      }]
    });
  }
}

export default HistoryDetail;
