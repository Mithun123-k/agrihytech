import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useField } from "formik";
import AppInput from "./AppInput";
import { scale } from "../../utils/responsive";

const PasswordInput = ({ name, label, ...props  }) => {

  const [show, setShow] = useState(false);
  const [field, meta, helpers] = useField(name);

  return (
    <View>

      <AppInput
        label={label}
        value={field.value}
        secureTextEntry={!show}
        onChangeText={text => helpers.setValue(text)}
        error={meta.error}
        touched={meta.touched}
        {...props }
        
      />

      <TouchableOpacity
        style={styles.eye}
        onPress={() => setShow(!show)}
      >
        <Icon
          name={show ? "eye-off" : "eye"}
          size={20}
        />
      </TouchableOpacity>

    </View>
  );
};

export default PasswordInput;

const styles = StyleSheet.create({
  eye: {
    position: "absolute",
    right: scale(12),
    top: scale(38),
  },
});