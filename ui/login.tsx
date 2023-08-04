import React from 'react';
import { createRoot } from 'react-dom/client';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import zhCN from 'antd/locale/zh_CN';
import { ConfigProvider, Layout, theme } from 'antd';
import './Global.css'

dayjs.locale('zh-cn');

const App = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    console.log("colorBgContainer", colorBgContainer);
    

    return (
        <ConfigProvider locale={zhCN}>
            <Layout>
                <Layout.Header style={{ padding: 0, background: colorBgContainer }}>Header</Layout.Header>
                <Layout.Content>Content</Layout.Content>
                <Layout.Footer style={{ textAlign: 'center' }} >Message Client ©2023 Created by JinLi Methy</Layout.Footer>
            </Layout>
        </ConfigProvider>
    );
};

document.body.innerHTML = '<div id="app"></div>';
const root = createRoot(document.getElementById('app') as Element);
root.render(<App />);