
import { useState } from "react";
import { Button, TextField, Card, CardContent, CardHeader, Alert } from "@mui/material";

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (e.target.username.value !== 'admin' || e.target.password.value !== 'admin123') {
            setError('Credenciales incorrectas');
            return;
        }
        onLogin({username: 'admin'});
    }

    return (
        <div className="login-container">
            <Card className="login-card">
                <CardHeader title="Iniciar Sesión" subheader="Ingrese sus credenciales" />
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Usuario"
                            name="username"
                            InputProps={{ startAdornment: <User size={18} /> }}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Contraseña"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            InputProps={{
                                startAdornment: <Lock size={18} />,
                                endAdornment: (
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                ),
                            }}
                            margin="normal"
                            required
                        />
                        {error && <Alert severity="error">{error}</Alert>}
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            sx={{ mt: 23 }}
                        >

                            Iniciar Sesión

                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}