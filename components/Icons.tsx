import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { useTheme } from 'react-native-paper';

interface IconProps {
  size?: number;
  color?: string;
}

export const BriefcaseIcon: React.FC<IconProps> = ({ size = 24, color }) => {
  const theme = useTheme();
  const iconColor = color || theme.colors.text;
  return (
    <Svg width={size} height={size} fill={iconColor} viewBox="0 0 256 256">
      <Path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,72v41.61A184,184,0,0,1,128,136a184.07,184.07,0,0,1-88-22.38V72Zm0,128H40V131.64A200.19,200.19,0,0,0,128,152a200.25,200.25,0,0,0,88-20.37V200ZM104,112a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H112A8,8,0,0,1,104,112Z" />
    </Svg>
  );
};

export const HouseIcon: React.FC<IconProps> = ({ size = 24, color }) => {
  const theme = useTheme();
  const iconColor = color || theme.colors.text;
  return (
    <Svg width={size} height={size} fill={iconColor} viewBox="0 0 256 256">
      <Path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z" />
    </Svg>
  );
};

export const ArrowLeftIcon: React.FC<IconProps> = ({ size = 24, color }) => {
  const theme = useTheme();
  const iconColor = color || theme.colors.text;
  return (
    <Svg width={size} height={size} fill={iconColor} viewBox="0 0 256 256">
      <Path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
    </Svg>
  );
};