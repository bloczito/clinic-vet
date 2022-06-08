import React from 'react';
import './Hello_Component.css';
import {Button} from "@mui/material";
import InstagramIcon from '@mui/icons-material/Instagram';
import PinDropIcon from '@mui/icons-material/PinDrop';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import { useRef } from "react";

interface props {

}

const HelloComponent: React.FC<props> = () => {
    const aboutUs = useRef<HTMLDivElement>(document.createElement("div"));

    const executeScroll = () => aboutUs.current.scrollIntoView({ behavior: 'smooth' });

    return (
        <div className="landing-page">
            <div className="landing-page-header">
                <div className="text-box">
                    <p className="sub-description">
                        Przychodnia weterynaryjna
                    </p>
                    <h3>
                        Ty i Twoje zwierzęta jesteście dla nas najważniejsi
                    </h3>
                    <p>
                        Umawiaj wizyty, przeglądaj historię leczenia, ciesz się profesjonalną opieką.
                    </p>
                    <Button className="home-btn" variant="contained" onClick={executeScroll}>Dowiedz się więcej</Button>
                </div>
                <img src={"4198540.jpg"} alt={"Sweet dog and vet"}/>
            </div>
            <div className="landing-page-about-us" ref={aboutUs}>
                <h3>Poznaj nasz zespół</h3>
                <h4>Ponieważ nasza praca jest też naszą pasją</h4>
                <div className="landing-page-about-us__vets">
                    <div className="box">
                        <div className="img">
                            <img src={"vet1.jpg"} alt={"Vet 1"}/>
                        </div>
                        <p className="name">lek. wet. Magdalena Stefanowicz</p>
                        <p className="description">Ukończyłam Wydział Medycyny Weterynaryjnej w Warszawie. Biorę udział
                            w wielu konferencjach i szkoleniach poświęconych tematyce chorób skóry dzięki czemu jestem
                            na bieżąco ze wszystkimi najnowszymi protokołami leczenia.</p>
                    </div>

                    <div className="box">
                        <div className="img">
                            <img src={"vet2.jpg"} alt={"Vet 2"}/>
                        </div>
                        <p className="name">lek. wet. Dariusz Koczur</p>
                        <p className="description">Zwierzaki pomagają nam być lepszymi ludźmi, a my możemy sprawić, by
                            żyło im się lepiej! Jestem lekarzem przede wszystkim z pasji i zamiłowania, a dopiero potem
                            z wykształcenia. O każdego zwierzaka walczę do końca i nigdy się nie poddaję!</p>
                    </div>

                    <div className="box">
                        <div className="img">
                            <img src={"vet3.jpg"} alt={"Vet 3"}/>
                        </div>
                        <p className="name">lek. wet. Agnieszka Adamczyk</p>
                        <p className="description">
                            Posiadam ponad 30 - letni staż w pracy ze zwierzętami, a więc ogromne doświadczenie. Każdy
                            zwierzak to dla mnie nie "kolejny przypadek", ale życie, które trzeba szanować i
                            ratować.</p>
                    </div>
                </div>
            </div>

            <div className="footer">
                <div className="contact-us">
                    <p className="title">Contact us</p>
                    <p><a href="mailto:contact@vetclinic.com">contact@vetclinic.com</a></p>
                    <p><a href="tel:+48 653 545 683">+48 653 545 683</a></p>
                    <p>VAT-ID 65 5368 63678 63</p>
                </div>

                <div className="find-us">
                    <p className="title">Find Us</p>
                    <div className="location">
                        <PinDropIcon/>
                        <div>
                            <p>VetClinic </p>
                            <p>Krakowska 32</p>
                            <p>Kraków</p>
                        </div>
                    </div>

                    <div className="social-media">
                        <InstagramIcon/>
                        <FacebookIcon/>
                        <GoogleIcon/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HelloComponent;
