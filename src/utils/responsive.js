import { Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get("window");

// Base size (design was made for iPhone 11 width)
const baseWidth = 375;
const baseHeight = 812;

// Scale based on width
export const scale = size => (width / baseWidth) * size;

// Scale based on height
export const verticalScale = size => (height / baseHeight) * size;

// Moderate scale (best for fonts)
export const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// Responsive font
export const responsiveFont = size => {
  const newSize = moderateScale(size);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};