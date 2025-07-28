import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
const items = [
  {
    key: 'Dashboard',
    label: (
      <Link to="/">Panel de Control</Link>
    ),
  },
  {
    key: 'Expedientes',
    label: (
      <Link to="/expedientes">Expedientes</Link>
    ),
  },
  {
    key: 'Formulario de Derivación',
    label: (
      <Link to="/formulario-derivacion">Nueva Derivación</Link>
    ),
  },
  {
    key: 'Agenda',
    label: (
      <Link to="/agenda">Agendamiento</Link>
    ),
  },
  {
    key: 'Alertas',
    label: (
      <Link to="/alertas">Alertas</Link>
    ),
  },
  {
    key: 'Perfil',
    label: (
      <Link to="/perfil">Perfil</Link>
    ),
  },
];
const Navbar = () => {
  const [current, setCurrent] = useState('mail');
  const onClick = e => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
};
export default Navbar;