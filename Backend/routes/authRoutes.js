import express from 'express';
import {
  registrarUsuario,
  loginUsuario,
  obtenerPerfil,
  actualizarPerfil,
  cambiarPassword,
  verificarUsuario
} from '../controllers/authController.js';

const router = express.Router();

// Rutas de autenticación
router.post('/registrar', registrarUsuario);
router.post('/login', loginUsuario);
router.post('/perfil', obtenerPerfil);
router.put('/perfil', actualizarPerfil);
router.put('/cambiar-password', cambiarPassword);
router.post('/verificar', verificarUsuario);

export default router;
