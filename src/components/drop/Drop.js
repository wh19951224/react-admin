import React, { Component } from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import MenuSider from './child/menu'
import DropBox from './child/dropdown'
import { Row, Col, Card, Tabs, Button } from 'antd';
const TabPane = Tabs.TabPane;

const menuSider = <MenuSider />
const dropBox = <DropBox />
const componentList = [menuSider, dropBox]

class Drop extends Component {
  constructor(props) {
    super(props);
    this.newTabIndex = 0;
    const panes = [
        { title: 'Tab 1', content: 'Content of Tab Pane 1', key: '1' },
        { title: 'Tab 2', content: 'Content of Tab Pane 2', key: '2' },
    ];
    this.state = {
        activeKey: panes[0].key,
        panes,
        mode: 'top'
    };
  }

  add = () => {
    const panes = this.state.panes;
    const activeKey = `newTab${this.newTabIndex++}`;
    panes.push({ title: 'New Tab', content: 'New Tab Pane', key: activeKey });
    this.setState({ panes, activeKey });
  };
  onChange = (activeKey) => {
    this.setState({ activeKey });
  };
  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  render() {
    return (
      <div>
        <BreadcrumbCustom first="drop" />
        <div className="drop-main">
          <Card title="带删除和新增" bordered={false}>
            <div style={{ marginBottom: 16 }}>
              <Button onClick={this.add}>ADD</Button>
            </div>
            <Tabs
              hideAdd
              onChange={this.onChange}
              activeKey={this.state.activeKey}
              type="editable-card"
              onEdit={this.onEdit}
            >
              {this.state.panes.map(pane => <TabPane tab={pane.title} key={pane.key}>
                {componentList[pane.key-1]}
                </TabPane>)}
            </Tabs>
          </Card>
        </div>
      </div>
    )
  }
}

export default Drop;