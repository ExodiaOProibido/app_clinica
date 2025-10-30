import React, {useEffect} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

const Logo = require('../../../assets/logo.png');

const Splash =({navigation} => {

    useEffect( () => {
        setTimeout( () => {
            navigation.replace('Menu');}, 3000)
            
    })
})