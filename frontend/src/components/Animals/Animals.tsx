import React, {useEffect, useState} from 'react';
import './Animals.css';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputAdornment,
    TextField
} from "@mui/material";
import PetsIcon from '@mui/icons-material/Pets';
import Typography from '@mui/material/Typography';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DesktopDatePicker} from '@mui/x-date-pickers/DesktopDatePicker';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {Pet, PetErrors, Species} from "../../types/animals.types";
import moment from "moment";
import {animalsApi} from "../../api/animals.api";
import MyAnimalsList from "./MyAnimalsList/MyAnimalsList";

interface props {

}

const Animals: React.FC<props> = () => {
    const [open, setOpen] = React.useState(false);
    const [speciesList, setSpeciesList] = useState<Species[]>([]);

    const [formIsValid, setFormIsValid] = useState(false);

    const [name, setName] = useState('');
    const [weight, setWeight] = useState(10);
    const [height, setHeight] = useState(10);
    const [race, setRace] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(new Date('2022-01-01T21:11:54'));
    const [species, setSpecies] = useState('2');
    const [additionalSpecies, setAdditionalSpecies] = useState('');

    const [nameError, setNameError] = useState('');
    const [weightError, setWeightError] = useState('');
    const [heightError, setHeightError] = useState('');

    const [isNameError, setIsNameError] = useState(false);
    const [isWeightError, setIsWeightError] = useState(false);
    const [isHeightError, setIsHeightError] = useState(false);

    const [invalidDateOfBirth, setInvalidDateOfBirth] = useState(false);
    const [serverError, setServerError] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleDateChange = (newDate: Date | null) => {
        if (newDate && moment(newDate).isValid()) {
            setDateOfBirth(newDate);
            setInvalidDateOfBirth(false);
        } else {
            setInvalidDateOfBirth(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const isValidForm = (): boolean => {
        // console.log("name", name)
        // console.log("race ", race)
        // console.log("weight", weight)
        // console.log("height", height)

        if (name === '') {
            console.log("Puste imie")
            setNameError("Podaj imię zwierzęcia!");
            setIsNameError(true);
            return false;
        } else {
            setNameError("");
            setIsNameError(false);
        }

        if (weight === 0) {
            console.log("waga pusta")
            setWeightError("Podaj wagę zwierzęcia!");
            setIsWeightError(true)
            return false;
        } else if (weight < 0) {
            setWeightError("Waga nie może być liczbą ujemną!");
            setIsWeightError(true)
            return false;
        } else {
            setWeightError("");
            setIsWeightError(false)
        }

        if (height === 0) {
            setHeightError("Podaj wzrost zwierzęcia!");
            setIsHeightError(true);
            return false;
        } else if (height < 0) {
            setHeightError("Wzrost nie może być liczbą ujemną!");
            setIsHeightError(true);
            return false;
        } else {
            setHeightError("");
            setIsHeightError(false);
        }
        //
        // console.log(nameError)
        console.log(isNameError)
        // console.log(weightError)
        console.log(isWeightError)
        //
        console.log(isHeightError)
        // console.log(!(isNameError || isWeightError || isHeightError))
        // console.log((isNameError || isWeightError || isHeightError))

        return true;
        // return !(isNameError && isWeightError && isHeightError)
    }


    useEffect(() => {
        animalsApi.getAllSpecies().then(res => setSpeciesList(res));
    }, [])

    // useEffect(() => {
    //     if (formIsValid && isSubmit && !invalidDateOfBirth) {
    //         addNewPet()
    //     }
    // }, [formIsValid, invalidDateOfBirth, isSubmit])

    const addNewPet = () => {
        console.log("invalidDateOfBirth: ", invalidDateOfBirth)
        console.log("isValidForm(): ", isValidForm())
        console.log("formIsValid && isSubmit: ", formIsValid && invalidDateOfBirth)

        if (isValidForm()) {
            animalsApi.addNewPet({
                name,
                weight,
                height,
                race,
                species: Number(species),
                additionalSpecies: additionalSpecies,
                dateOfBirth: moment(dateOfBirth).format("YYYY-MM-DD"),
            }).then(() => {
                setOpen(false);
                setServerError("")
            }, () => {
                setServerError("Wystąpił błąd, odśwież stronę i spróbuj jeszcze raz.")
            })
        }
    };

    return (
        <div style={{width: "68%", marginLeft: "25%", padding: "5%"}}>
            <div className="animals__header">
                <Typography variant="h4" gutterBottom component="div">
                    Moje zwierzęta
                </Typography>

                <Button variant="contained" disabled={speciesList.length === 0} startIcon={<PetsIcon/>}
                        onClick={handleClickOpen}>
                    Dodaj zwierzę
                </Button>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Dodaj nowe zwierzę</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        autoFocus
                                        required
                                        fullWidth
                                        margin="dense"
                                        id="name"
                                        name="name"
                                        label="Imię"
                                        type="text"
                                        variant="outlined"
                                        value={name}
                                        onChange={(e: any) => setName(e.target.value)}
                                        error={isNameError}
                                        helperText={nameError}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="species">Gatunek</InputLabel>
                                    <Select
                                        labelId="species"
                                        id="species-select"
                                        name="species"
                                        value={species}
                                        label="Gatunek"
                                        onChange={(event: SelectChangeEvent) => {
                                            setSpecies(event.target.value as string)
                                        }}
                                    >
                                        {speciesList.map(({id, name}) => <MenuItem key={id}
                                                                                   value={id}>{name}</MenuItem>)}

                                    </Select>
                                </FormControl>
                            </Grid>

                            {Number(species) === 1 &&
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <TextField
                                            fullWidth
                                            margin="dense"
                                            id="name"
                                            name="additionalSpecies"
                                            label="Możesz podać gatunek, którego nie znalazłeś"
                                            type="text"
                                            variant="outlined"
                                            value={additionalSpecies}
                                            onChange={(event) => {
                                                setAdditionalSpecies(event.target.value as string)
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            }

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        id="race"
                                        name="race"
                                        label="Rasa"
                                        type="text"
                                        variant="outlined"
                                        value={race}
                                        onChange={(e: any) => setRace(e.target.value)}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <TextField
                                        fullWidth
                                        required
                                        margin="dense"
                                        id="weight"
                                        name="weight"
                                        label="Waga zwierzęcia"
                                        type="number"
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">kg</InputAdornment>,
                                            inputProps: {min: 0}
                                        }}
                                        value={weight}
                                        onChange={(e: any) => setWeight(Number(e.target.value))}
                                        error={isWeightError}
                                        helperText={weightError}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <TextField
                                        fullWidth
                                        required
                                        margin="dense"
                                        id="height"
                                        name="height"
                                        label="Wzrost zwierzęcia"
                                        type="number"
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">cm</InputAdornment>,
                                            inputProps: {min: 0}
                                        }}
                                        value={height}
                                        onChange={(e: any) => setHeight(Number(e.target.value))}
                                        error={isHeightError}
                                        helperText={heightError}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DesktopDatePicker
                                        label="Data urodzenia"
                                        inputFormat="dd/MM/yyyy"
                                        value={dateOfBirth}
                                        onChange={handleDateChange}
                                        renderInput={(params) => <TextField required fullWidth {...params} />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography color="red" gutterBottom component="p">
                                {serverError}
                            </Typography>
                        </Grid>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose}>ANULUJ</Button>
                        <Button
                            variant="contained"
                            onClick={(e) => addNewPet()}>
                            DODAJ ZWIERZĘ
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

            <MyAnimalsList/>
        </div>
    )
}

export default Animals;
