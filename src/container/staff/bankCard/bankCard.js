import React from 'react';
import fetch from 'common/js/fetch';
import XLSX from 'xlsx';
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
import { getDict } from 'api/dict';

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
      projectCode: '',
      positionObj: {
        0: '普工',
        1: '主管'
      },
      bankCardStatusObj: {}
    };
  }
  componentDidMount() {
    Promise.all([
      getUserDetail(getUserId()),
      getDict('bankcard_number_status')
    ]).then(([res1, res2]) => {
      this.setState({ projectCode: res1.projectCode });
      res2.map((item) => {
        this.state.bankCardStatusObj[item.dkey] = item.dvalue;
      });
    });
  }
  render() {
    const fields = [{
      field: 'staffCode',
      title: '员工编号',
      hidden: true
    }, {
      field: 'staffName',
      title: '姓名'
    }, {
      field: 'idNo',
      title: '身份证号'
    }, {
      field: 'staffMobile',
      title: '手机号'
    }, {
      field: 'departmentName',
      title: '部门'
    }, {
      field: 'position',
      title: '职位',
      formatter: (v, d) => {
        return this.state.positionObj[d.position];
      }
    }, {
      field: 'bankSubbranchName',
      title: '开户行'
    }, {
      field: 'bankcardNumber',
      title: '卡号'
    }, {
      field: 'keyword',
      title: '关键字查询',
      placeholder: '姓名/手机号',
      search: true,
      hidden: true
    }, {
      field: 'numberStatus',
      title: '现状',
      key: 'bankcard_number_status',
      type: 'select'
    }, {
      field: 'numberStatus',
      placeholder: '现状',
      key: 'bankcard_number_status',
      search: true,
      hidden: true,
      type: 'select'
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
      },
      export: (selectedRowKeys, selectedRows) => {
        this.props.doFetching();
        fetch(631425, {projectCode: this.state.projectCode, limit: 10000, start: 1}).then((data) => {
          this.props.cancelFetching();
          let tableData = [];
          let title = [];
          fields.map((item) => {
            if (item.title !== '员工编号' && item.title !== '关键字查询') {
              title.push(item.title);
            }
          });
          tableData.push(title);
          data.list.map((item) => {
            let temp = [];
            temp.push(
                item.staffName,
                item.idNo,
                item.staffMobile,
                item.departmentName,
                this.state.positionObj[item.position],
                item.bankSubbranchName,
                item.bankcardNumber,
                this.state.bankCardStatusObj[item.numberStatus]
            );
            tableData.push(temp);
          });
          const ws = XLSX.utils.aoa_to_sheet(tableData);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
          XLSX.writeFile(wb, '工资卡信息.xlsx');
        });
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