import React from 'react';
import Header from './Header';
import SubHeader from './SubHeader';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <SubHeader />
      <main>{children}</main>
    </>
  );
};

export default Layout;
