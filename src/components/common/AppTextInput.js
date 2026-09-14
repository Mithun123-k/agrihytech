import React from 'react';
import { TextInput } from 'react-native';
import { useLanguage } from '../../i18n/LanguageContext';

const AppTextInput = React.forwardRef(({ placeholder, ...props }, ref) => {
  const { t } = useLanguage();
  return <TextInput ref={ref} placeholder={t(placeholder)} {...props} />;
});

export default AppTextInput;
