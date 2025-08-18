import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin, Result, Button } from 'antd';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ 
  children, 
  requiredPermissions = null, 
  requiredRoles = null,
  fallbackComponent = null 
}) => {
  const { isAuthenticated, userProfile, loading, hasPermission, hasRole } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  // Redirigir a login si no está autenticado
  if (!isAuthenticated || !userProfile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar permisos específicos si se requieren
  if (requiredPermissions) {
    const { seccion, accion = 'ver' } = requiredPermissions;
    if (!hasPermission(seccion, accion)) {
      return fallbackComponent || (
        <Result
          status="403"
          title="Acceso Denegado"
          subTitle={`No tienes permisos para ${accion} en ${seccion}`}
          extra={
            <Button type="primary" onClick={() => window.history.back()}>
              Volver
            </Button>
          }
        />
      );
    }
  }

  // Verificar roles específicos si se requieren
  if (requiredRoles && requiredRoles.length > 0) {
    if (!hasRole(...requiredRoles)) {
      return fallbackComponent || (
        <Result
          status="403"
          title="Acceso Denegado"
          subTitle={`Se requiere uno de los siguientes roles: ${requiredRoles.join(', ')}`}
          extra={
            <Button type="primary" onClick={() => window.history.back()}>
              Volver
            </Button>
          }
        />
      );
    }
  }

  // Si pasa todas las verificaciones, renderizar el componente
  return children;
};

export default ProtectedRoute;
