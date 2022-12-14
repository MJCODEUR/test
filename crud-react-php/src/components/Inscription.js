import { useState } from "react";
import "../assets/style/inscription.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SetCookie from "./cookie/SetCookie";
import RemoveCookie from "./cookie/RemoveCookie";
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
// import jwt_decode from "jwt-decode";
import GetCookie from "./cookie/GetCookie";
import Container from 'react-bootstrap/Container';
// btn
import Button from 'react-bootstrap/Button';


export default function Inscription() {
    const navigate = useNavigate();
    let note;
    let noteLocation = document.getElementById('not');
    const [inputs, setInputs] = useState([]);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    }
    const handleSubmit = (event) => {
        event.preventDefault();

        // axios.post('https://api-eazyevent.herokuapp.com/api/user/create.php', inputs).then(function (response) {
        axios.post('http://localhost/test/api-php-natif/api/user/create.php', inputs).then(function (response) {
            console.log(response.data);

            if (response.data.message === "user already in server") {
                console.log('deja');
                note = "cet email est déjà enregisté ; vérifiez votre email ou allez plutôt vous connecter"
            }
            else if (response.data.message === "user Created") {
                // axios.post('https://api-eazyevent.herokuapp.com/api/user/authentification.php', inputs)
                axios.post('http://localhost/test/api-php-natif/api/user/authentification.php', inputs)
                // axios.post('http://localhost/test/api-php-natif/jwt-auth', inputs)
                .then(function (response) {
                    let data = response.data;
                    console.log(data);
                  
                   
                    if (data && data.status === 1) {
    
    
                        RemoveCookie('logged');
                         data = JSON.stringify(data)
                                SetCookie('logged', data);
    
    
                        if (data.organisation_profil === 'true') {
                            console.log('exist profil');
                             switch (data.type) {
                            case 1:                               
                                navigate('/services/organisateur/dashboard');
                                break;
                            case 2:
                                    navigate('/services/participant');
                                break;
                                default:
                                note = "Nous ne savons si vous ête organisateur ou participant";
                                navigate('./');
                                break;
    
                        }
                        }
    
                        else {
                            console.log("no profil ");
                            navigate('/organisation/create');
                        }
                      
                    } else {
    
                        note = "Vérifiez vos informations et réessayez";
                    }
                })
                .catch(error => console.log(error));
    
        }
            else{
                note = "Desolé veillez réessayer"

            };
        });
        if (note) {
            noteLocation.innerHTML = note;
        }
    }
    return (
        <Container>
            <div className="inscription-form-container">
                <div className="inscription-form">

                    <h1 className="form-title">Inscription</h1>
                    <form className="Inscription-form" onSubmit={handleSubmit}>

                        <div className="full">
                            <div className="half">
                                <label>Nom </label></div>
                            <div className="half">
                                <label>Prenom </label>
                            </div>
                        </div>

                        <div className="full">
                            <div className="half">
                                <input type="text" required name="fname" onChange={handleChange} />
                            </div>
                            <div className="half">
                                <input type="text" required name="lname" onChange={handleChange} />
                            </div>
                        </div>

                        <div className="full">
                            <label>E-mail </label>
                        </div>

                        <div className="full">
                            <input type="email" required name="email" onChange={handleChange} />
                        </div>

                        <div className="full">
                            <label>Mot de passe </label>
                        </div>

                        <div className="full">
                            <input type="password" required name="password" onChange={handleChange} />
                        </div>

                        <div className="full">
                            <label>Telephone </label>
                        </div>

                        <div className="full">
                            <input type="text" required name="tel" onChange={handleChange} />
                        </div>

                        <div className="full">
                            <label for="type">
                                Vous êtes organisateur ou participant ?
                            </label>
                        </div>

                        <div className="full">
                            <select className="full" required name="type" onChange={handleChange}>
                                <option value="">veillez selectioner</option>
                                <option value="1">Organisateur</option>
                                <option value="2">Participant</option>
                            </select>
                        </div>
                        <div className="form-btn-div">
                            <Button type="submit" className="form-btn">Enregistrer</Button>
                        </div>
                        <div id="not">

                        </div>
                        <div className="form-btn-div">
                            si vous avez déjà un compte, <Link to='/connexion'>connectez vous ici</Link>
                        </div>

                    </form>

                </div>
            </div>
        </Container>
    )
}
