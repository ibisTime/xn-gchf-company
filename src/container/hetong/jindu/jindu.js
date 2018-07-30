import React from 'react';
import { Timeline, Button, Divider, List, Avatar, Menu, Icon } from 'antd';
import {
  setTableData,
  setPagination,
  setBtnList,
  setSearchParam,
  clearSearchParam,
  doFetching,
  cancelFetching,
  setSearchData
} from '@redux/hetong/jindu';
import { listWrapper } from 'common/js/build-list';
import { getUserDetail, getjinduO, getjinduList, getjindu } from 'api/user';
import { getUserKind, getUserId, formatImg, formatDate, getQueryString } from 'common/js/util';
import { relative } from 'path';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

@listWrapper(
  state => ({
    ...state.hetongJindu
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class Jindu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      proList: [],
      proTitle: '',
      projectCode: ''
    };
  }
  componentDidMount() {
    getUserDetail(getUserId()).then((data) => {
      this.setState({ projectCode: data.projectCode });
      getjinduO(this.state.projectCode).then(data => {
        this.setState({
          data: data
        });
      });
    });
  }
  goBack() {
    this.props.history.go(-1);
  };
  addjindu() {
    this.props.history.push(`/hetong/jindu/addedit`);
  }
  render() {
    const { data, proList, proTitle } = this.state;
    return (
      <div>
        <div style={{ display: 'inline-block' }}>
          <h2>{proTitle || '所有项目的进度'}</h2>
          <Button type='primary' onClick={this.addjindu.bind(this)}>新增进度</Button>
        </div>
        <Divider />
        <div style={{ paddingLeft: 200, paddingTop: 60, display: 'inline-block' }}>
          <Timeline key={0}>
            {data.length
              ? data.map(v => <Timeline.Item key={v.code}>{formatDate(v.datetime)}&nbsp;&nbsp;{v.projectName}&nbsp;&nbsp;<div style={{ display: 'inline-block', width: 200 }}>{v.description}</div><img src={formatImg(v.picture)} style={{ width: 100, height: 90, display: 'inlineBlock', verticalAlign: 'text-top', position: 'relative', left: -580, top: -40 }} /></Timeline.Item>)
              : <Timeline.Item>该项目没有录入进度</Timeline.Item>}
          </Timeline>
        </div>
      </div>
    );
  }
}

export default Jindu;
