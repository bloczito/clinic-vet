import * as React from 'react';
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
import {FormControl, FormHelperText} from "@mui/material";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router";


interface Account {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    repeatPassword: string;
}

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.primary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Clinic Vet
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}


export default function SignUp() {
    const navigate = useNavigate();

    let createNewAccount: Account = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        repeatPassword: '',
    }

    const [formValues, setFormValues] = useState(createNewAccount);
    const [formErrors, setFormErrors] = useState(createNewAccount);
    const [submitError, setSubmitError] = useState("");
    const [isSubmit, setIsSubmit] = useState(false);

    const handleChange = (event: any) => {
        const {name, value} = event.target;
        setFormValues({...formValues, [name]: value});
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormErrors(validate(formValues));
        setIsSubmit(true);
    };

    const validate = (values: Account) => {
        const errors: any = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regex.test(values.email)) {
            errors.email = "Podaj poprawny adres email"
        }

        if ((values.password !== values.repeatPassword) && (values.repeatPassword !== '')) {
            errors.password = "Hasła muszą być identyczne"
        }

        return errors;
    }

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            console.log("Valid Form ", formValues);

            createAccount(formValues).then(
                () => {
                    navigate("/signIn");
                }).catch(
                (error) => {
                    if (error.response.data.error === "User already exist") {
                        setFormErrors({...formErrors, email: 'Ten adres e-mail jest już zajęty, wybierz inny.'})
                    } else {
                        setSubmitError("Wystąpił błąd serwera, odśwież i spróbuj jeszcze raz.")
                    }

                    setIsSubmit(false);
                });
        }
    }, [formErrors, isSubmit, formValues, navigate]);

    async function createAccount(form: Account) {
        return axios.post('/register/', form);
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
                    Załóż konto
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{mt: 3}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FormControl>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="Imię"
                                    autoFocus
                                    value={formValues.firstName}
                                    onChange={handleChange}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Nazwisko"
                                    name="lastName"
                                    autoComplete="family-name"
                                    value={formValues.lastName}
                                    onChange={handleChange}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Adres Email"
                                    name="email"
                                    autoComplete="email"
                                    error={!!formErrors.email}
                                    helperText={formErrors.email}
                                    value={formValues.email}
                                    onChange={handleChange}
                                />
                                <FormHelperText id="my-helper-text">Email będzie służył do logowania.</FormHelperText>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Hasło"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    value={formValues.password}
                                    onChange={handleChange}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <TextField
                                    required
                                    fullWidth
                                    name="repeatPassword"
                                    label="Powtórz Hasło"
                                    type="password"
                                    id="repeatPassword"
                                    error={!!formErrors.password}
                                    helperText={formErrors.password}
                                    value={formValues.repeatPassword}
                                    onChange={handleChange}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography color="red" gutterBottom component="p">
                                {submitError}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Załóż konto
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/signIn" variant="body2">
                                Masz już konto? Zaloguj się!
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{mt: 5}}/>
        </Container>
    );
}
