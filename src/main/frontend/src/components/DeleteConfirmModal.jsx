import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { AlertTriangle } from "lucide-react";

export function DeleteConfirmModal({isOpen, onClose, onConfirm, userName}) {
    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle clasName="flex items-center gap-2">
                <AlertTriangle className="text-red-500" />
                Confirmar eliminación
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Esta accion no se puede deshacer. ¿Estás seguro de que deseas eliminar a <strong>{userName}</strong>?
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="outlined">Confirmar</Button>
                <Button onClick={onConfirm} variant="contained" color="error">Eliminar</Button>
            </DialogActions>
        </Dialog>
    );
}