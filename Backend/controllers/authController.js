import { 
  crearUsuario, 
  obtenerUsuarioPorEmail, 
  obtenerUsuarioPorId, 
  actualizarUsuario,
  obtenerUsuariosPorEstablecimiento,
  obtenerUsuariosPorRol
} from '../models/Usuario.js';

// Registro de usuario
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, rol, telefono, password, establecimientoId } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await obtenerUsuarioPorEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ 
        error: 'El email ya está registrado' 
      });
    }

    // Crear usuario
    const nuevoUsuario = await crearUsuario({
      nombre,
      email,
      rol,
      telefono,
      establecimientoId,
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
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son requeridos' 
      });
    }

    // Buscar usuario por email
    const usuario = await obtenerUsuarioPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
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
    const { userId, nombre, telefono, email } = req.body;

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

    if (email && !email.includes('@')) {
      return res.status(400).json({ 
        error: 'El email no es válido' 
      });
    }

    // Actualizar usuario
    const datosActualizados = { nombre, telefono };
    if (email) {
      datosActualizados.email = email;
    }

    const usuarioActualizado = await actualizarUsuario(userId, datosActualizados);

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

// Obtener usuarios por establecimiento
export const obtenerUsuariosPorEstablecimientoCtrl = async (req, res) => {
  try {
    const { establecimientoId } = req.params;
    
    if (!establecimientoId) {
      return res.status(400).json({
        error: 'ID del establecimiento es requerido'
      });
    }
    
    const usuarios = await obtenerUsuariosPorEstablecimiento(establecimientoId);
    
    // Remover passwords de la respuesta
    const usuariosSinPassword = usuarios.map(usuario => {
      const { password: _, ...usuarioSinPassword } = usuario;
      return usuarioSinPassword;
    });
    
    res.json({
      usuarios: usuariosSinPassword,
      total: usuariosSinPassword.length,
      establecimientoId
    });
  } catch (error) {
    console.error('Error al obtener usuarios por establecimiento:', error);
    res.status(500).json({
      error: 'Error al obtener usuarios',
      details: error.message
    });
  }
};

// Obtener usuarios por rol
export const obtenerUsuariosPorRolCtrl = async (req, res) => {
  try {
    const { rol } = req.params;
    
    if (!['docente', 'trabajador_social', 'jefe_convivencia'].includes(rol)) {
      return res.status(400).json({
        error: 'Rol inválido. Debe ser: docente, trabajador_social o jefe_convivencia'
      });
    }
    
    const usuarios = await obtenerUsuariosPorRol(rol);
    
    // Remover passwords de la respuesta
    const usuariosSinPassword = usuarios.map(usuario => {
      const { password: _, ...usuarioSinPassword } = usuario;
      return usuarioSinPassword;
    });
    
    res.json({
      usuarios: usuariosSinPassword,
      total: usuariosSinPassword.length,
      rol
    });
  } catch (error) {
    console.error('Error al obtener usuarios por rol:', error);
    res.status(500).json({
      error: 'Error al obtener usuarios',
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
  verificarUsuario,
  obtenerUsuariosPorEstablecimientoCtrl,
  obtenerUsuariosPorRolCtrl
};
