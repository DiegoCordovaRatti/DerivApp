import React from 'react'
import { Outlet } from "react-router-dom";
import { Layout as AntLayout } from 'antd';
import Navbar from '../components/navbar/Navbar'
import Footer from '../components/footer/Footer'
import './Layout.scss';

const { Content } = AntLayout;

const Layout = () => {
  return (
    <AntLayout className='app-layout'>
      <Navbar/>
      <Content className='main-content'>
        <Outlet/>
      </Content>
      <Footer/>
    </AntLayout>
  )
}

export default Layout