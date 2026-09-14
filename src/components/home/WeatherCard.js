import AppText from '../common/AppText';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const WeatherCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <AppText style={{fontSize:30}}>☀️</AppText>
        <View style={{marginLeft:10}}>
          <AppText style={{color:'#555'}}>Bhopal, M.P</AppText>
          <AppText style={styles.temp}>28°C</AppText>
        </View>
      </View>

      <View>
        <AppText>Sunny</AppText>
        <AppText style={{color:'green'}}>🌧 65%</AppText>
      </View>
    </View>
  );
};

export default WeatherCard;

const styles = StyleSheet.create({
  card:{
    backgroundColor:'#fff',
    marginTop:15,
    padding:16,
    borderRadius:16,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  left:{flexDirection:'row',alignItems:'center'},
  temp:{fontSize:22,fontWeight:'bold'}
});
