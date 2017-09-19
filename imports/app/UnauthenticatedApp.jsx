import React from 'react';
// import PropTypes from 'prop-types';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import AccountsUI from './pages/AccountsUI.jsx';

const { Header, Content, Footer } = Layout;

const UnauthenticatedApp = ({ match }) => {
  const rootUrl = match.url;
  return (
    <Layout className="main layout fit">
      <style jsx>{`
.logo {
  height: 90%;
}
.logo img {
  height: 100%;
}
.main {
  height: 100vh;
}
        `}</style>
      <Header>
        <div className="logo layout horizontal center-justified">
          <img src="/img/white_flower.png" />
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          style={{ lineHeight: '64px' }}
        >
          {
            // <Menu.Item key="1">nav 1</Menu.Item>
            // <Menu.Item key="2">nav 2</Menu.Item>
            // <Menu.Item key="3">nav 3</Menu.Item>
          }
        </Menu>
      </Header>
      <Content className="layout vertical">
        <div className="content flex layout vertical">
          <Switch>
            <Redirect exact from={`${rootUrl}/`} to={`${rootUrl}/account`} />
            {
              <Route path={`${rootUrl}/account`} component={AccountsUI} />
            }
          </Switch>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        COMMON GARDEN
        <div>
          Software and automation for Growers of all kinds
        </div>
      </Footer>
    </Layout>
  );
};

export default UnauthenticatedApp;
