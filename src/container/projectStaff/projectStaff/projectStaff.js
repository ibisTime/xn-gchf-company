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
} from '@redux/projectStaff/projectStaff';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, showSucMsg, getUserKind, getUserId, formatDate } from 'common/js/util';
import { getUserDetail } from 'api/user';

@listWrapper(
  state => ({
    ...state.projectStaff,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class ProjectStaff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageCode: null,
      projectCode: ''
    };
  }
  componentDidMount() {
    let userKind = getUserKind();
    this.setState({ userKind });
    getUserDetail(getUserId()).then((data) => {
      this.setState({ 'projectCode': data.projectCode });
    });
  }
  render() {
    const featStatusData = [{
      dkey: '0',
      dvalue: '无效'
    }, {
      dkey: '1',
      dvalue: '有效'
    }];
    const pict1StatusData = [{
      dkey: '0',
      dvalue: '未拍摄'
    }, {
      dkey: '1',
      dvalue: '已拍摄'
    }];
    const fields = [{
      field: 'staffName',
      title: '姓名'
    }, {
      field: 'idNo',
      title: '身份证号码',
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
      title: '职位',
      type: 'select',
      key: 'position_type'
    }, {
      field: 'pict1Status',
      title: '图片信息',
      data: pict1StatusData,
      keyName: 'dkey',
      valueName: 'dvalue'
    }, {
      field: 'featStatus',
      title: '特征值状态',
      data: featStatusData,
      keyName: 'dkey',
      valueName: 'dvalue'
    }, {
      field: 'keyword',
      title: '关键字查询',
      placeholder: '姓名/手机号',
      hidden: true,
      search: true
    }, {
      field: 'projectCode',
      placeholder: '部门',
      listCode: '631036',
      params: {
        projectCode: this.state.projectCode
      },
      keyName: 'code',
      valueName: 'name',
      type: 'select',
      hidden: true,
      search: true
    }, {
      field: 'pict1Status',
      placeholder: '图片信息',
      data: pict1StatusData,
      type: 'select',
      keyName: 'dkey',
      valueName: 'dvalue',
      hidden: true,
      search: true
    }, {
      field: 'featStatus',
      placeholder: '特征值状态',
      data: featStatusData,
      type: 'select',
      keyName: 'dkey',
      valueName: 'dvalue',
      hidden: true,
      search: true
    }];
    const btnEvent = {
      // 请假
      weekday: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/projectStaff/projectStaff/weekday?code=${selectedRows[0].code}&projectCode=${selectedRows[0].projectCode}`);
        }
      },
      // 离职
      quit: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/projectStaff/projectStaff/quit?code=${selectedRows[0].staffCode}&projectCode=${selectedRows[0].projectCode}`);
        }
      },
      // 详情
      detail: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/projectStaff/projectStaff/addedit?v=1&code=${selectedRowKeys[0]}&staffCode=${selectedRows[0].staffCode}`);
        }
      },
      // 重新入职
      reruzhi: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/projectStaff/projectStaff/ruzhiInfo?code=${selectedRows[0].code}&reruzhi=1&staffCode=${selectedRows[0].staffCode}`);
        }
      },
      // 补录合同
      addContract: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/projectStaff/addContract?code=${selectedRowKeys[0]}&projectCode=${this.state.projectCode}`);
        }
      }
    };
    return this.state.projectCode ? this.props.buildList({
      fields,
      btnEvent,
      searchParams: {
        updater: '',
        projectCode: this.state.projectCode
      },
      pageCode: 631465
    }) : null;
  }
}

export default ProjectStaff;
