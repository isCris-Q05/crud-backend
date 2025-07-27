import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl } from "@mui/material";
import {InputLabel, Select, MenuItem, Switch, FormControlLabel, Avatar} from "@mui/material";
import { Upload, Close } from "@mui/icons-material";
import { useState } from "react";

export function UserModal({ open, onClose, mode, userData }) {
  const [formData, setFormData] = useState({
    username: userData?.username || "",
    email: userData?.email || "",
    role: userData?.role || "user",
    active: userData?.status === "active" || true,
  });

  const handleSubmit = () => {
    // Validación básica
    if (!formData.username || !formData.email) {
      alert("Completa todos los campos requeridos");
      return;
    }
    onClose(formData);
  };

  return (
    <Dialog open={open} onClose={() => onClose(null)} fullWidth maxWidth="sm">
      <DialogTitle>
        {mode === "create" ? "Crear Usuario" : "Editar Usuario"}
      </DialogTitle>
      <DialogContent dividers>
        <div className="form-row">
          <Avatar sx={{ width: 60, height: 60 }}>
            {formData.username.charAt(0) || "U"}
          </Avatar>
          <Button variant="outlined" startIcon={<Upload />} component="label">
            Subir Foto
            <input type="file" hidden />
          </Button>
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
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Rol</InputLabel>
          <Select
            value={formData.role}
            label="Rol"
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
        <Button onClick={() => onClose(null)}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {mode === "create" ? "Crear" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
