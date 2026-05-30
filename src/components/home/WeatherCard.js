import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const WeatherCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={{fontSize:30}}>☀️</Text>
        <View style={{marginLeft:10}}>
          <Text style={{color:'#555'}}>Bhopal, M.P</Text>
          <Text style={styles.temp}>28°C</Text>
        </View>
      </View>

      <View>
        <Text>Sunny</Text>
        <Text style={{color:'green'}}>🌧 65%</Text>
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
