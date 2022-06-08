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
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import PetsIcon from '@mui/icons-material/Pets';
import Typography from '@mui/material/Typography';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DesktopDatePicker} from '@mui/x-date-pickers/DesktopDatePicker';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {Species, UserPet} from "../../types/animals.types";
import moment from "moment";
import {animalsApi} from "../../api/animals.api";
import MyAnimalsList from "./MyAnimalsList/MyAnimalsList";
import MyVisitsHistory from "./MyHistoryList/MyVisitsHistory";

interface props {

}

const Animals: React.FC<props> = () => {
    const [open, setOpen] = React.useState(false);
    const [userAnimals, setUserAnimals] = useState<UserPet[]>([]);
    const [speciesList, setSpeciesList] = useState<Species[]>([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState('');
    const [weight, setWeight] = useState<number>(10);
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
        clearForm();
    };

    const isValidForm = (): boolean => {
        if (name === '') {
            setNameError("Podaj imię zwierzęcia!");
            setIsNameError(true);
            return false;
        } else {
            setNameError("");
            setIsNameError(false);
        }

        if (weight === 0) {
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

        return true;
    }

    const getAnimalsList = () => {
        animalsApi.getUserPets().then((res: UserPet[]) => setUserAnimals(res));
    }

    const clearForm = () => {
        setName("");
        setWeight(10);
        setHeight(10);
        setRace("");
        setSpecies('2');
        setAdditionalSpecies("");
        setName("");
        setDateOfBirth(new Date('2022-01-01T21:11:54'));
    }

    useEffect(() => {
        getAnimalsList()
    }, [])

    useEffect(() => {
        animalsApi.getAllSpecies().then(res => setSpeciesList(res));
    }, [])

    const addNewPet = () => {
        if (isValidForm() && !invalidDateOfBirth) {
            setIsButtonDisabled(true)
            setIsLoading(true);
            animalsApi.addNewPet({
                name,
                weight,
                height,
                race,
                speciesId: Number(species),
                additionalSpecies: additionalSpecies,
                dateOfBirth: moment(dateOfBirth).format("YYYY-MM-DD"),
            }).then(() => {
                getAnimalsList()
                setOpen(false);
                clearForm();
                setServerError("");
                setIsButtonDisabled(false);
                setIsLoading(false);
            }, () => {
                setIsButtonDisabled(false);
                setIsLoading(false);
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
                    {isLoading && <Box sx={{width: '100%'}}>
                        <LinearProgress/>
                    </Box>}

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
                                        value={weight === 0 ? "" : weight}
                                        onChange={(e) => setWeight(Number(e.target.value))}
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
                                        value={height === 0 ? "" : height}
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
                            disabled={isButtonDisabled}
                            onClick={() => addNewPet()}>
                            DODAJ ZWIERZĘ
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

            <MyAnimalsList userAnimals={userAnimals} getAnimalsList={getAnimalsList}/>

            <Typography variant="h4" gutterBottom component="div" style={{marginTop: '70px'}}>
                  Historia wizyt
            </Typography>
            <MyVisitsHistory />

        </div>
    )
}

export default Animals;
