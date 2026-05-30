import React from "react";
import { useField } from "formik";
import AppInput from "./AppInput";

const FormikInput = ({ name, ...props }) => {

  const [field, meta, helpers] = useField(name);

  return (
    <AppInput
      {...props}
      value={field.value}
      onChangeText={text => helpers.setValue(text)}
      error={meta.error}
      touched={meta.touched}
    />
  );
};

export default FormikInput;