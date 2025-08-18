import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "../views/Dashboard/Dashboard";
import Login from "../views/Login/Login";
import Perfil from "../views/Perfil/Perfil";
import Expedientes from "../views/Expedientes/Expedientes";
import FormularioDerivacion from "../views/FormularioDerivacion/FormularioDerivacion";
import Agenda from "../views/Agenda/Agenda";
import Alertas from "../views/Alertas/Alertas";
import Error from "../views/Error/Error";

export const routes = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        element: <Layout />,
        children: [
            {
                path: '/',
                element: (
                    <ProtectedRoute requiredPermissions={{ seccion: 'dashboard' }}>
                        <Dashboard />
                    </ProtectedRoute>
                )
            },
            {
                path: '/dashboard',
                element: (
                    <ProtectedRoute requiredPermissions={{ seccion: 'dashboard' }}>
                        <Dashboard />
                    </ProtectedRoute>
                )
            },
            {
                path: '/perfil',
                element: (
                    <ProtectedRoute>
                        <Perfil />
                    </ProtectedRoute>
                )
            },
            {
                path: '/expedientes',
                element: (
                    <ProtectedRoute requiredPermissions={{ seccion: 'expedientes', accion: 'ver' }}>
                        <Expedientes />
                    </ProtectedRoute>
                )
            },
            {
                path: '/formulario-derivacion',
                element: (
                    <ProtectedRoute requiredPermissions={{ seccion: 'derivaciones', accion: 'crear' }}>
                        <FormularioDerivacion />
                    </ProtectedRoute>
                )
            },
            {
                path: '/agenda',
                element: (
                    <ProtectedRoute requiredPermissions={{ seccion: 'agenda', accion: 'ver' }}>
                        <Agenda />
                    </ProtectedRoute>
                )
            },
            {
                path: '/alertas',
                element: (
                    <ProtectedRoute requiredPermissions={{ seccion: 'alertas', accion: 'ver' }}>
                        <Alertas />
                    </ProtectedRoute>
                )
            },
            {
                path: '*',
                element: <Error />
            }
        ]
    }
]);