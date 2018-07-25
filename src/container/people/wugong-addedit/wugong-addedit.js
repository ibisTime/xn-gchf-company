import React from 'react';
import cookies from 'browser-cookies';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/people/wugong-addedit';
import { getQueryString, getUserKind, getUserId } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { getUserDetail } from 'api/user';

@DetailWrapper(
  state => state.peopleWugongAddEdit,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class PWugongAddedit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      departmentCode: '',
      companyCode: ''
    };
    this.code = getQueryString('code', this.props.location.search);
  }
  componentDidMount() {
    if (getUserKind() === 'S') {
      getUserDetail(getUserId()).then((data) => {
        this.setState({ projectCodeList: data.projectCodeList });
      });
    };
    if (getUserKind() === 'O') {
      getUserDetail(getUserId()).then((data) => {
        console.log(data.companyCode);
        this.setState({ companyCode: data.companyCode });
      });
    };
  }
  render() {
    const fieldso = [{
      field: 'staffCode',
      value: this.code,
      hidden: true
    }, {
      field: 'name',
      title: '姓名',
      readonly: true
    }, {
      field: 'projectCode',
      title: '所属工程',
      type: 'select',
      listCode: '631357',
      params: {
        companyCode: this.state.companyCode,
        updater: ''
      },
      keyName: 'code',
      valueName: 'name',
      required: true
    }, {
      field: 'type',
      title: '员工类别',
      type: 'select',
      key: 'staff_type',
      required: true
    }, {
      field: 'position',
      title: '职位',
      required: true
    }, {
      field: 'salary',
      title: '薪酬',
      amount: true,
      required: true
    }, {
      field: 'joinDatetime',
      title: '入职时间',
      type: 'date',
      required: true
    }, {
      field: 'upUser',
      title: '上级',
      type: 'select',
      listCode: '631086',
      params: {
        type: cookies.get('loginKind'),
        companyCode: this.state.companyCode
      },
      keyName: 'userId',
      valueName: 'realName',
      required: true
    }, {
      field: 'cutAmount',
      title: '迟到/早退每小时扣款金额',
      amount: true,
      required: true
    }, {
      field: 'contractDatetime',
      title: '签约时间',
      type: 'date',
      required: true
    }, {
      field: 'contentPic',
      title: '合同照片',
      type: 'img',
      single: true
    }, {
      field: 'remark',
      title: '备注'
    }];
    if (cookies.get('loginKind') === 'O') {
      return this.state.companyCode ? this.props.buildDetail({
        fields: fieldso,
        code: this.code,
        detailCode: 631417,
        editCode: 631460
      }) : null;
    }
  }
}

export default PWugongAddedit;
