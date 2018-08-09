import React from 'react';
import { Collapse } from 'antd';
import { getUserId } from 'common/js/util';
import { getHelpList } from 'api/general';
import './contactWithUs.css';
import erweima from './erweima.jpeg';
import close from './close.png';
const Panel = Collapse.Panel;

class ContactWithUs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal1Visible: false,
      modal2Visible: false,
      contact: false,
      help: false,
      helpArr: []
    };
  }
  componentDidMount() {
    getHelpList({
      orderColumn: 'order_no',
      orderDir: 'asc'
    }).then((res) => {
      let helpArr = [];
      res.map((item) => {
        let helpObj = {};
        helpObj.code = item.code;
        helpObj.title = item.title;
        helpObj.content = item.content;
        helpArr.push(helpObj);
      });
      this.setState({ helpArr });
    });
  }
  tab(index) {
    this.props.setContactWithUsVisible(true, event, index === 1 ? 1 : 2);
    // index === 1 ? this.setState({ contact: true, help: false }) : this.setState({ help: true, contact: false });
  }
  render() {
    const panelStyle = {
      background: 'transparent'
    };
    return this.state.helpArr ? (
        <div className="modal-out ant-modal-mask" style={{ display: this.props.contactWithUsVisible ? 'block' : 'none' }}>
          <div className="my-modal">
            <div className="tab">
              <div className={['tab-item', this.props.contact && 'choose'].join(' ')} onClick={() => { this.tab(1); }}><span>联系我们</span></div>
              <div className={['tab-item', !this.props.contact && 'choose'].join(' ')} onClick={() => { this.tab(2); }}><span>操作指引</span></div>
              <div className="close" onClick={(e) => { this.props.setContactWithUsVisible(false, event); }}><img src={close} alt=""/></div>
            </div>
            <div className="content">
              { this.props.contact
                  ? <div className="contact">
                    <div className="contact-top">
                      <p>软件客服微信：15372288898或扫描二维码添加</p>
                      <p>在线时间：9：30--17：30</p>
                      <p>紧急情况可来电咨询</p>
                    </div>
                    <div className="contact-content">
                      <img src={erweima} alt=""/>
                    </div>
                  </div>
                  : <div className="help">
                    <Collapse accordion onChange={this.collapseChange} className="home-collapse1">
                      {
                        this.state.helpArr.map((item) => {
                          return (
                              <Panel header={item.title} key={item.code} style={panelStyle}>
                                <div dangerouslySetInnerHTML={{ __html: item.content }}></div>
                              </Panel>
                          );
                        })
                      }
                    </Collapse>
                  </div>
              }
            </div>
          </div>
        </div>
    ) : null;
  }
}
//
// ReactDOM.render(<App />, mountNode);

export default ContactWithUs;
