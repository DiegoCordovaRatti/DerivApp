import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
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
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Dashboard />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/perfil',
                element: <Perfil />
            },
            {
                path: '/expedientes',
                element: <Expedientes />
            },
            {
                path: '/formulario-derivacion',
                element: <FormularioDerivacion />
            },
            {
                path: '/agenda',
                element: <Agenda />
            },
            {
                path: '/alertas',
                element: <Alertas />
            },
            {
                path: '*',
                element: <Error />
            }
        ]
    }
]);