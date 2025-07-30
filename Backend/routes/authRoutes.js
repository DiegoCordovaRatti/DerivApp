import express from 'express';
import {
  registrarUsuario,
  loginUsuario,
  obtenerPerfil,
  actualizarPerfil,
  cambiarPassword,
  verificarUsuario,
  obtenerUsuariosPorEstablecimientoCtrl,
  obtenerUsuariosPorRolCtrl
} from '../controllers/authController.js';

const router = express.Router();

// ===== RUTAS DE AUTENTICACIÓN =====

// Rutas básicas de autenticación
router.post('/registrar', registrarUsuario);
router.post('/login', loginUsuario);
router.post('/perfil', obtenerPerfil);
router.put('/perfil', actualizarPerfil);
router.put('/cambiar-password', cambiarPassword);
router.post('/verificar', verificarUsuario);

// ===== RUTAS DE USUARIOS =====

// Rutas de consulta de usuarios
router.get('/establecimiento/:establecimientoId', obtenerUsuariosPorEstablecimientoCtrl);
router.get('/rol/:rol', obtenerUsuariosPorRolCtrl);

export default router;
