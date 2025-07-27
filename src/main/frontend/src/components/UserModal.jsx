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
  Snackbar,
  Alert,
} from "@mui/material";
import { Upload, Close } from "@mui/icons-material";
import { useState } from "react";

export function UserModal({ open, onClose, mode, userData, onCreateSuccess }) {
  const [formData, setFormData] = useState({
    username: userData?.username || "",
    email: userData?.email || "",
    password: "", // solo para la creacion
    role: userData?.role || "user",
    active: userData?.status === "active" || true,
    profile_picture_link: userData?.profile_picture_link || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    // Validación básica
    if (
      !formData.username ||
      !formData.email ||
      (mode === "create" && !formData.password)
    ) {
      setError("Completa todos los campos requeridos");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Llamada al servicio para crear usuario
      const newUser = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        profile_picture_link: formData.profile_picture_link, // Transformación a camelCase
        role: formData.role,
        active: formData.active,
      };

      const createdUser = await onCreateSuccess(newUser);

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err.message || "Error al crear usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={() => onClose()} fullWidth maxWidth="sm">
        <DialogTitle>
          {mode === "create" ? "Crear Usuario" : "Editar Usuario"}
          <Button
            onClick={() => onClose()}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </Button>
        </DialogTitle>

        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <div
            className="form-row"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <Avatar
              src={formData.profile_picture_link}
              sx={{ width: 60, height: 60 }}
            >
              {formData.username.charAt(0) || "U"}
            </Avatar>
            <TextField
              label="URL de la foto de perfil"
              fullWidth
              size="small"
              value={formData.profile_picture_link}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  profile_picture_link: e.target.value,
                })
              }
            />
          </div>

          <TextField
            label="Nombre de usuario"
            fullWidth
            margin="normal"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />

          {mode === "create" && (
            <TextField
              label="Contraseña"
              fullWidth
              margin="normal"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          )}

          <FormControl fullWidth margin="normal">
            <InputLabel>Rol</InputLabel>
            <Select
              value={formData.role}
              label="Rol"
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <MenuItem value="admin">Administrador</MenuItem>
              <MenuItem value="user">Usuario</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
              />
            }
            label="Usuario activo"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => onClose()} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading
              ? "Procesando..."
              : mode === "create"
              ? "Crear"
              : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Usuario creado exitosamente!
        </Alert>
      </Snackbar>
    </>
  );
}
