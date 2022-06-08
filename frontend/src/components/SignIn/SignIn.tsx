import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from "axios";
import {useNavigate} from "react-router";
import {UserContext} from "../../context/UserContext";

interface Props {
    setToken: Function;
}

interface SignInAccount {
    email: string;
    password: string
}

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Clinic Vet
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}


export default function SignIn() {
    const navigate = useNavigate();
    let signInAccount: SignInAccount = {
        email: '',
        password: '',
    }

    const {logIn} = useContext(UserContext)
    const [formValues, setFormValues] = useState(signInAccount);
    const [isSubmit, setIsSubmit] = useState(false);
    const [error, setError] = useState(false);

    const handleChange = (event: any) => {
        const {name, value} = event.target;
        setFormValues({...formValues, [name]: value});
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmit(true);
    };

    useEffect(() => {
        if (isSubmit) {
            loginUser(formValues).then((res) => {
                    if (res.data.success) {

                        logIn(res.data.success.toString(), res.data.isDoctor.toString())

                        // if (res.data.isDoctor.toString() === 'True') {
                        //     navigate("/dashboard/doc-timetable");
                        // } else {
                        //     navigate("/dashboard/animals");
                        // }

                    } else {
                        // setToken(res.data.success);
                        setError(true);
                        setIsSubmit(false);
                    }
                },
                () => {
                    console.log('Server Error')
                    setError(true);
                    setIsSubmit(false);
                });
        }
    }, [isSubmit, formValues, navigate]);

    async function loginUser(credentials: SignInAccount) {
        return axios.post('/login/', credentials);
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{m: 1, bgcolor: 'primary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Zaloguj się
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{mt: 1}}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={formValues.email}
                        onChange={handleChange}
                        error={error}
                        helperText={error ? "Nieprawidłowe dane logowania" : ""}
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        value={formValues.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        error={error}
                        helperText={error ? "Nieprawidłowe dane logowania" : ""}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Sign In
                    </Button>

                    <Grid container>
                        <Grid item>
                            <Link href="/signUp" variant="body2">
                                {"Nie masz jeszcze konta? Załóż konto"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{mt: 8, mb: 4}}/>
        </Container>
    );
}
