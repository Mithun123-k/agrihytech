import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { responsiveFont, scale } from "../../utils/responsive";

const AppInput = ({
  label,
  error,
  touched,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={styles.input}
        {...props}
        placeholderTextColor={'#7F7F7F'}
      />

      {touched && error && (
        <Text style={styles.error}>{error}</Text>
      )}
    </View>
  );
};

export default AppInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: scale(12),
  },

  label: {
    fontSize: responsiveFont(14),
    marginBottom: scale(4),
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: scale(10),
    padding: scale(12),
    fontSize: responsiveFont(14),
    backgroundColor:'#ffffff'
  },

  error: {
    color: "red",
    fontSize: responsiveFont(12),
    marginTop: 3,
  },
});