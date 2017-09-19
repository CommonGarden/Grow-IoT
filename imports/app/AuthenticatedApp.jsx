import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Route, Redirect, Link, Switch } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class AuthenticatedApp extends Component {
  state = {
    collapsed: false,
  };
  componentWillMount() {
    document.title = 'Dashboard';
    // Check that the user is logged in before the component mounts
    if (!this.props.userId && !Meteor.loggingIn()) {
      this.props.history.push('/public/account');
    }
  }
  componentDidUpdate(prevProps, prevState) {
    // Now check that they are still logged in. Redirect to sign in page if they aren't.
    if (!this.props.userId) {
      this.props.history.push('/public/account');
    }
  }
  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  }
  handleLogout = (e) => {
    e.preventDefault();
    Meteor.logout();
  }
  render() {
    const logoClass = this.state.collapsed ? 'collapsed' : '';
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <style jsx>{`
.logo {
  height: 64px;
  padding: 2px 10px;
}
.logo span {
  font-size: 20px;
  color: white;
}
.logo img {
  height: 60px;
}
.logo.collapsed span {
  display: none;
}
.main {
  height: 100vh;
}
            `}</style>
          <div className={`logo layout horizontal center-justified ${logoClass}`}>
            <img src='/img/white_flower.png' alt="white flower logo" className="icon" />
            <span className="title layout vertical center-justified flex center">Grow IoT</span>
          </div>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1">
              <Icon type="pie-chart" />
              <span>Option 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="desktop" />
              <span>Option 2</span>
            </Menu.Item>
            <SubMenu
              key="sub1"
              title={<span><Icon type="user" /><span>User</span></span>}
            >
              <Menu.Item key="3">Tom</Menu.Item>
              <Menu.Item key="4">Bill</Menu.Item>
              <Menu.Item key="5">Alex</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={<span><Icon type="team" /><span>Team</span></span>}
            >
              <Menu.Item key="6">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="9">
              <a href="/logout" onClick={this.handleLogout}>
                <Icon type="logout" />
                <span>Logout</span>
              </a>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '12px 0' }}>
              <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              Under development;
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            COMMON GARDEN
            <div>
              Software and automation for Growers of all kinds
            </div>
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
AuthenticatedApp.propTypes = {
  userId: PropTypes.string,
};

export default AuthenticatedAppContainer = withTracker(() => {
  return {
    userId: Meteor.userId(),
  };
})(AuthenticatedApp);
