import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Avatar,
  IconButton,
  Box,
  Typography,
  Snackbar,
  Alert
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useState, useEffect } from "react";
import userService from "../services/userService";

export function EditUserModal({ open, user, onClose, onSave }) {
  if (!user) return null;
  
  const [formData, setFormData] = useState({
    username: user.username || "",
    email: user.email || "",
    status: user.isActive === false ? "inactive" : "active",
    profilePictureLink: user.profilePictureLink || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);

  const [currentUsername, setCurrentUsername] = useState(localStorage.getItem('user'));

  // Verificamos si estamos editando nuestro propio perfil 
  const isCurrentUser = user?.username === currentUsername;

  // Efecto para manejar actualización de tokens
  useEffect(() => {
    const handleTokenUpdate = () => {
      // Forzar actualización del componente cuando cambia el token
      setForceUpdate(prev => !prev);
    };

    window.addEventListener('token-updated', handleTokenUpdate);
    return () => {
      window.removeEventListener('token-updated', handleTokenUpdate);
    };
  }, []);

  // Efecto para resetear el formulario cuando cambia el usuario o se abre/cierra
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        status: user.isActive === false ? "inactive" : "active",
        profilePictureLink: user.profilePictureLink || "",
      });
    }
    setError(null); // Limpiar errores al abrir el modal
  }, [user, open, forceUpdate]); // Agregamos forceUpdate a las dependencias

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

   const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);

            const updatedUser = {
                username: formData.username,
                email: formData.email,
                profilePictureLink: formData.profilePictureLink || "",
                isActive: formData.status === "active",
                originalUsername: user.username // Enviar el username original
            };

            await userService.updateUser(user.id, updatedUser);
            
            if (isCurrentUser && formData.username !== user.username) {
                setSuccess('Usuario actualizado. Tu sesión se ha mantenido activa.');
            } else {
                setSuccess('Usuario actualizado exitosamente');
            }
            
            setTimeout(() => {
                onSave();
                onClose();
            }, 1500);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Editar Usuario: {formData.username}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 3 }}>
          {/* Mostrar mensaje de error si existe */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Foto de perfil */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
            <Avatar
              sx={{ width: 80, height: 80, fontSize: "2rem" }}
              src={formData.profilePictureLink || ""}
            >
              {formData.username?.charAt(0)}
            </Avatar>
            <TextField
              fullWidth
              label="URL de la foto de perfil"
              name="profilePictureLink"
              value={formData.profilePictureLink || ""}
              onChange={handleChange}
              margin="normal"
              sx={{ mb: 0 }}
            />
          </Box>

          {/* Campos del formulario */}
          <TextField
            fullWidth
            label="Nombre de usuario"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
            sx={{ mb: 2 }}
            error={error?.toLowerCase().includes("nombre de usuario")}
            helperText={error?.toLowerCase().includes("nombre de usuario") ? error : ""}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            sx={{ mb: 2 }}
            error={error?.toLowerCase().includes("email")}
            helperText={error?.toLowerCase().includes("email") ? error : ""}
          />

          <FormControlLabel
            control={
              <Switch
                name="status"
                checked={formData.status === "active"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.checked ? "active" : "inactive",
                  })
                }
                color="primary"
              />
            }
            label="Usuario activo"
            labelPlacement="start"
            sx={{ justifyContent: "space-between", mx: 0, mt: 1 }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="outlined" sx={{ mr: 1 }}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            sx={{ minWidth: 120 }}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para éxito */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {success}
        </Alert>
      </Snackbar>
    </>
  );
}