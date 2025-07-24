import { crearUsuario, obtenerUsuarioPorCorreo, obtenerUsuarioPorId, actualizarUsuario } from '../models/Usuario.js';

// Registro de usuario
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, rol, telefono, password } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await obtenerUsuarioPorCorreo(correo);
    if (usuarioExistente) {
      return res.status(400).json({ 
        error: 'El correo electrónico ya está registrado' 
      });
    }

    // Crear usuario
    const nuevoUsuario = await crearUsuario({
      nombre,
      correo,
      rol,
      telefono,
      activo: true,
      password: password
    });

    // Remover password de la respuesta
    const { password: _, ...usuarioSinPassword } = nuevoUsuario;

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      usuario: usuarioSinPassword
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

// Login de usuario
export const loginUsuario = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Validar campos requeridos
    if (!correo || !password) {
      return res.status(400).json({ 
        error: 'Correo y contraseña son requeridos' 
      });
    }

    // Buscar usuario por correo
    const usuario = await obtenerUsuarioPorCorreo(correo);
    if (!usuario) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return res.status(401).json({ 
        error: 'Usuario inactivo' 
      });
    }

    // Verificar contraseña
    if (usuario.password !== password) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Remover password de la respuesta
    const { password: _, ...usuarioSinPassword } = usuario;

    res.json({
      message: 'Login exitoso',
      usuario: usuarioSinPassword
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

// Obtener perfil del usuario
export const obtenerPerfil = async (req, res) => {
  try {
    const { userId } = req.body; // Recibimos el ID en el body
    
    if (!userId) {
      return res.status(400).json({
        error: 'ID de usuario requerido'
      });
    }

    const usuario = await obtenerUsuarioPorId(userId);

    if (!usuario) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }

    // Remover password de la respuesta
    const { password: _, ...usuarioSinPassword } = usuario;

    res.json({
      usuario: usuarioSinPassword
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

// Actualizar perfil del usuario
export const actualizarPerfil = async (req, res) => {
  try {
    const { userId, nombre, telefono } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: 'ID de usuario requerido'
      });
    }

    // Validar campos
    if (!nombre || nombre.trim().length < 2) {
      return res.status(400).json({ 
        error: 'El nombre debe tener al menos 2 caracteres' 
      });
    }

    // Actualizar usuario
    const usuarioActualizado = await actualizarUsuario(userId, {
      nombre,
      telefono
    });

    // Remover password de la respuesta
    const { password: _, ...usuarioSinPassword } = usuarioActualizado;

    res.json({
      message: 'Perfil actualizado exitosamente',
      usuario: usuarioSinPassword
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

// Cambiar contraseña
export const cambiarPassword = async (req, res) => {
  try {
    const { userId, passwordActual, passwordNueva } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: 'ID de usuario requerido'
      });
    }

    // Validar campos
    if (!passwordActual || !passwordNueva) {
      return res.status(400).json({ 
        error: 'Contraseña actual y nueva son requeridas' 
      });
    }

    if (passwordNueva.length < 6) {
      return res.status(400).json({ 
        error: 'La nueva contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Obtener usuario actual
    const usuario = await obtenerUsuarioPorId(userId);
    if (!usuario) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }

    // Verificar contraseña actual
    if (usuario.password !== passwordActual) {
      return res.status(401).json({ 
        error: 'Contraseña actual incorrecta' 
      });
    }

    // Actualizar contraseña
    await actualizarUsuario(userId, {
      password: passwordNueva
    });

    res.json({
      message: 'Contraseña cambiada exitosamente'
    });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

// Verificar usuario
export const verificarUsuario = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        error: 'ID de usuario requerido'
      });
    }

    const usuario = await obtenerUsuarioPorId(userId);
    
    if (!usuario) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    // Remover password de la respuesta
    const { password: _, ...usuarioSinPassword } = usuario;

    res.json({
      message: 'Usuario válido',
      usuario: usuarioSinPassword
    });

  } catch (error) {
    console.error('Error al verificar usuario:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

export default {
  registrarUsuario,
  loginUsuario,
  obtenerPerfil,
  actualizarPerfil,
  cambiarPassword,
  verificarUsuario
};
