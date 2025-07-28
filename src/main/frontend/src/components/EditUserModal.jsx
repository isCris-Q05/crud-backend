import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Avatar,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { Close, CloudUpload } from "@mui/icons-material";
import { useState, useEffect } from "react"; // Añadimos useEffect
import userService from "../services/userService"; // Agrega la importación

export function EditUserModal({ open, user, onClose, onSave }) {
  // si no hay usuario, no se abre el modal
  if (!user) return null;
  const [formData, setFormData] = useState({
    username: user.username || "",
    email: user.email || "",
    status: user.isActive === false ? "inactive" : "active",
    profilePictureLink: user.profilePictureLink || "",

  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Efecto para actualizar el estado cuando cambia el usuario
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        status: user.isActive === false ? "inactive" : "active",
        profilePictureLink: user.profilePictureLink || "",
      });
    }
  }, [user]); // Se ejecuta cuando cambia el usuario

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.email) {
      alert("Por favor complete todos los campos requeridos");
      return;
    }
    try {
      // Llama al endpoint de edición
      const updatedUser = {
        username: formData.username,
        email: formData.email,
        profilePictureLink: formData.profilePictureLink || "",
        isActive: formData.status === "active" ? true : false
      }
      await userService.updateUser(user.id, updatedUser);
      onSave({
        ...user,
        username: formData.username,
        email: formData.email,
        profilePictureLink: formData.profilePictureLink || "",
        isActive: formData.status === "active" ? true : false
      });
      onClose();
    } catch (error) {
      alert("Error al editar usuario");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Editar Usuario: {formData.username}{" "}
          {/* Usamos formData en lugar de user directamente */}
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 3 }}>
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
        />

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Rol</InputLabel>
            <Select
              name="role"
              value={formData.role}
              label="Rol"
              onChange={handleChange}
            >
              <MenuItem value="Administrator">Administrador</MenuItem>
              <MenuItem value="Team member">Miembro de equipo</MenuItem>
              <MenuItem value="Contributor">Colaborador</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Permisos</InputLabel>
            <Select
              name="permission"
              value={formData.permission}
              label="Permisos"
              onChange={handleChange}
            >
              <MenuItem value="Owner">Propietario</MenuItem>
              <MenuItem value="Editor">Editor</MenuItem>
              <MenuItem value="Viewer">Visualizador</MenuItem>
            </Select>
          </FormControl>
        </Box>

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
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
}
