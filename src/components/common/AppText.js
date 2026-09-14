import React from 'react';
import { Text } from 'react-native';
import { useLanguage } from '../../i18n/LanguageContext';

const translateChildren = (children, t) => React.Children.map(children, child =>
  typeof child === 'string' ? t(child) : child,
);

const AppText = ({ children, ...props }) => {
  const { t } = useLanguage();
  return <Text {...props}>{translateChildren(children, t)}</Text>;
};

export default AppText;
