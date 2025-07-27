import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  TextField, 
  Button, 
  Alert, 
  FormControlLabel, 
  Checkbox,
  Typography,
  Box
} from '@mui/material';
import { Lock, Person } from '@mui/icons-material';
import '../styles/LoginPage.css';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username !== 'admin' || password !== 'admin123') {
      setError('Credenciales incorrectas. Usa admin/admin123');
      return;
    }
    navigate('/dashboard');
  };

  return (
    <Box className="login-container">
      <Card className="login-card">
        <CardHeader 
          title={
            <Typography variant="h4" align="center" gutterBottom>
              Iniciar Sesión
            </Typography>
          }
          subheader={
            <Typography variant="body1" align="center" color="textSecondary">
              Ingresa tus credenciales para acceder al sistema
            </Typography>
          }
          className="card-header"
        />
        
        <CardContent className="card-content">
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Usuario"
              margin="normal"
              InputProps={{ 
                startAdornment: <Person sx={{ color: 'action.active', mr: 1 }} /> 
              }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              margin="normal"
              InputProps={{ 
                startAdornment: <Lock sx={{ color: 'action.active', mr: 1 }} /> 
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 1 }}
            />

            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Recordar sesión"
              sx={{ mb: 3 }}
            />

            <Button 
              fullWidth 
              type="submit" 
              variant="contained" 
              size="large"
              sx={{ 
                mt: 1,
                py: 1.5,
                fontWeight: 'bold'
              }}
            >
              INICIAR SESIÓN
            </Button>
          </form>

          <Box className="credentials-box">
            <Typography variant="body2" align="center" color="textSecondary">
              Credenciales de prueba:
            </Typography>
            <Typography variant="body2" align="center">
              <strong>Usuario:</strong> admin
            </Typography>
            <Typography variant="body2" align="center">
              <strong>Contraseña:</strong> admin123
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}