import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Avatar, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Person, Email, Badge, CalendarToday, Update, Lock, CheckCircle, Cancel } from '@mui/icons-material';

export const UserDetailsModal = ({ open, onClose, user }) => {
  if (!user) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Detalles del usuario</DialogTitle>
      <DialogContent dividers>
        <div className='user-details-header' style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar sx={{ width: 80, height: 80 }} src={user.profilePictureLink || undefined}>
            {!user.profilePictureLink && (user.username?.charAt(0) || "U")}
          </Avatar>
          <h3>{user.username}</h3>
        </div>
        <Divider sx={{ my: 2 }} />
        <List>
          <ListItem>
            <ListItemIcon><Person /></ListItemIcon>
            <ListItemText primary="ID" secondary={user.id} />
          </ListItem>
          <ListItem>
            <ListItemIcon><Email /></ListItemIcon>
            <ListItemText primary="Email" secondary={user.email} />
          </ListItem>
          <ListItem>
            <ListItemIcon>{user.isActive ? <CheckCircle color="success" /> : <Cancel color="error" />}</ListItemIcon>
            <ListItemText primary="Estado" secondary={user.isActive ? "Activo" : "Inactivo"} />
          </ListItem>
          <ListItem>
            <ListItemIcon><CalendarToday /></ListItemIcon>
            <ListItemText primary="Creado en" secondary={user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"} />
          </ListItem>
          <ListItem>
            <ListItemIcon><Update /></ListItemIcon>
            <ListItemText primary="Actualizado en" secondary={user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "-"} />
          </ListItem>
          <ListItem>
            <ListItemIcon><Person /></ListItemIcon>
            <ListItemText primary="Creado por" secondary={user.createdBy || "-"} />
          </ListItem>
          <ListItem>
            <ListItemIcon><Person /></ListItemIcon>
            <ListItemText primary="Actualizado por" secondary={user.updatedBy || "-"} />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};