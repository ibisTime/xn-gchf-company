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
} from '@redux/map/map';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, getUserKind, getUserId } from 'common/js/util';
import ModalDetail from 'common/js/build-modal-detail';
import { getUserDetail } from 'api/user';

@listWrapper(
  state => ({
    ...state.mapMap,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectCode: ''
    };
  }
  componentDidMount() {
    getUserDetail(getUserId()).then((res) => {
      this.setState({ projectCode: res.projectCode });
    });
  }
  render() {
    var btnEvent = {
      addProject: (selectedRowKeys, selectedRows) => {
        this.props.history.push(`/projectManage/project/addedit`);
      },
      Statistics: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/newProj/project/detail?v=1&code=${selectedRowKeys[0]}`);
        }
      },
      attendance: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/projectManage/project/kaoqin?code=${selectedRowKeys[0]}`);
        }
      },
      tiqingshenhe: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/projectManage/project/edit?v=1&code=${selectedRowKeys[0]}`);
        }
      },
      wages: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/projectManage/project/salary?projectCode=${selectedRowKeys[0]}`);
        }
      },
      proDetail: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/projectManage/project/addedit?v=1&projectCode=${selectedRowKeys[0]}`);
        }
      },
      allWages: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/projectManage/project/leijifaxin?v=1&projectCode=${selectedRowKeys[0]}`);
        }
      },
      overTime: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/projectManage/project/end?v=1&projectCode=${selectedRowKeys[0]}`);
        }
      },
      editPro: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/projectManage/project/addedit?projectCode=${selectedRowKeys[0]}`);
          // if (selectedRows[0].status === '3' || selectedRows[0].status === '4') {
          // } else {
          //   showWarnMsg('只有在建和停工的项目可以修改');
          // }
        }
      },
      checkPro: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/projectManage/project/check?v=1&projectCode=${selectedRowKeys[0]}`);
        }
      },
      overPro: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/projectManage/project/stop?stop=1&projectCode=${selectedRowKeys[0]}`);
        }
      },
      kCard: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/projectManage/project/daka?projectCode=${selectedRowKeys[0]}`);
        }
      },
      aWork: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/projectManage/project/stop?start=1&projectCode=${selectedRowKeys[0]}`);
        }
      },
      progress: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/hetong/jindu/info?start=1&projectCode=${selectedRowKeys[0]}`);
        }
      },
      makeSalary: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.setState({
            showMakeSalary: true
          });
          this.projectCode = selectedRowKeys[0];
        }
      },
      addBumen: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          if(selectedRows[0].status !== '5') {
            this.props.history.push(`/projectManage/project/addBumen?code=${selectedRows[0].code}`);
          }else {
            showWarnMsg('该项目已结束，不能新增部门');
          }
        }
      },
      salaryDelayDays: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          if(selectedRows[0].status === '3') {
            this.setState({
              showSalaryDelayDays: true
            });
            this.projectCode = selectedRowKeys[0];
          }else {
            showWarnMsg('该项目未处于在建状态，不能设置薪资发放可延迟天数');
          }
        }
      }
    };
    const fields = [{
      field: 'projectCode',
      formatter: (v, d) => {
        return d.name;
      },
      title: '工程名称',
      type: 'select',
      listCode: '631357',
      params: {
        updater: '',
        kind: 'O',
        companyCode: this.state.companyCode
      },
      keyName: 'code',
      valueName: 'name'
    }, {
      field: 'provinces',
      title: '项目详细地址',
      formatter: (v, d) => {
        return d.province ? d.province + d.city + d.area + d.address : '';
      }
    }, {
      field: 'startDatetime',
      title: '项目开始时间',
      type: 'date'
    }, {
      field: 'endDatetime',
      title: '项目结束时间',
      type: 'date'
    }, {
      field: 'chargeUser',
      title: '负责人'
    }, {
      field: 'chargeMobile',
      title: '负责人手机号'
    }, {
      title: '状态',
      field: 'status',
      key: 'project_status',
      type: 'select'
    }, {
      field: 'remark',
      title: '备注'
    }, {
      field: 'keyword',
      title: '关键字',
      placeholder: '手机号',
      hidden: true,
      search: true
    }];
    // 生成工资条
    const makeSalaryOptions = {
      fields: [{
        field: 'month',
        title: '生成工资月份',
        type: 'month',
        required: true
      }],
      addCode: 631440,
      beforeSubmit: (param) => {
        param.projectCode = this.projectCode;
        return param;
      },
      onOk: () => {
        this.props.getPageData();
      }
    };
    return this.state.projectCode ? (<div>{ this.props.buildList({
          fields,
          btnEvent,
          searchParams: {
            projectCode: this.state.projectCode
          },
          pageCode: 631356
        }
    )}<ModalDetail
        title='生成工资月份'
        visible={this.state.showMakeSalary}
        hideModal={() => this.setState({ showMakeSalary: false })}
        options={makeSalaryOptions} />
    </div>) : null;
  }
}

export default Map;
