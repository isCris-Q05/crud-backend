import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Avatar} from '@mui/material';
import {Divider, List, ListItem, ListItemIcon, ListItemText} from '@mui/material';

import {Person, Email, Badge, CalendarToday, Update} from '@mui/icons-material'

export const UserDetailsModal = ({open, onClose, user}) => {
    if (!user) return null;
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Detalles del usuario</DialogTitle>
            <DialogContent dividers>
                <div className='user-details-header'>
                    <Avatar sx={{width: 80, height: 80}}>
                        {user.username.charAt(0)}
                    </Avatar>
                    <h3>{user.username}</h3>
                </div>

                <Divider sx={{my: 2}} />

                <List>
                    <ListItem>
                        <ListItemIcon><Person/></ListItemIcon>
                        <ListItemText primary="ID" secondary={user.id}/>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><Email /></ListItemIcon>
                        <ListItemText primary="Email" secondary={user.email} />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><Badge /></ListItemIcon>
                        <ListItemText primary="Rol" secondary={user.role} />
                    </ListItem>
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" variant="outlined">Cerrar</Button>
            </DialogActions>
        </Dialog>
    )
}