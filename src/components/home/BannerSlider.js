import React, {
  useRef,
  useState,
  useEffect,
} from 'react';

import {
  View,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  Platform,
  PixelRatio,
} from 'react-native';

const { width, height } =
  Dimensions.get('window');

// ✅ Responsive Font
const responsiveFont = size => {
  const scale = width / 375;

  const newSize = size * scale;

  if (Platform.OS === 'ios') {
    return Math.round(
      PixelRatio.roundToNearestPixel(
        newSize,
      ),
    );
  }

  return (
    Math.round(
      PixelRatio.roundToNearestPixel(
        newSize,
      ),
    ) - 1
  );
};

// ✅ Width Percentage
const wp = percentage => {
  return (width * percentage) / 100;
};

// ✅ Height Percentage
const hp = percentage => {
  return (height * percentage) / 100;
};

// ✅ Responsive Banner Width
const BANNER_WIDTH =
  width - wp(10);

// ✅ Responsive Item Gap
const ITEM_SPACING = wp(3.5);

const BannerSlider = ({
  data = [],
}) => {
  const flatListRef = useRef();

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  // 🔁 AUTO SCROLL
  useEffect(() => {
    if (!data.length) return;

    const interval =
      setInterval(() => {
        let nextIndex =
          currentIndex + 1;

        if (
          nextIndex >=
          data.length
        ) {
          nextIndex = 0;
        }

        flatListRef.current?.scrollToIndex(
          {
            index: nextIndex,
            animated: true,
          },
        );

        setCurrentIndex(
          nextIndex,
        );
      }, 3000);

    return () =>
      clearInterval(interval);
  }, [
    currentIndex,
    data,
  ]);

  // 🖼️ RENDER IMAGE
  const renderItem = ({
    item,
  }) => (
    <Image
      source={
        item.image
          ? {
            uri: item.image,
          }
          : require('../../assets/images/banner.png')
      }
      style={styles.banner}
      resizeMode="cover"
    />
  );

  // ❌ NO BANNERS
  if (!data.length)
    return null;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(
          item,
          index,
        ) =>
          item._id ||
          index.toString()
        }
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={
          false
        }
        snapToInterval={
          BANNER_WIDTH +
          ITEM_SPACING
        }
        decelerationRate="fast"
        contentContainerStyle={
          styles.flatListContent
        }
        ItemSeparatorComponent={() => (
          <View
            style={{
              width:
                ITEM_SPACING,
            }}
          />
        )}
        onMomentumScrollEnd={event => {
          const index =
            Math.round(
              event.nativeEvent
                .contentOffset.x /
              (BANNER_WIDTH +
                ITEM_SPACING),
            );

          setCurrentIndex(
            index,
          );
        }}
      />

      {/* 🔵 DOTS */}
      <View
        style={
          styles.dotsContainer
        }
      >
        {data.map(
          (_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex ===
                index &&
                styles.activeDot,
              ]}
            />
          ),
        )}
      </View>
    </View>
  );
};

export default BannerSlider;

const styles =
  StyleSheet.create({
    container: {
      width: '100%',
    },

    // ✅ FlatList Padding
    flatListContent: {
      paddingHorizontal:
        wp(1),
    },

    // ✅ Banner Responsive
    // ✅ सिर्फ banner style को replace करो

    banner: {
      width: BANNER_WIDTH,

      // ✅ पहले fixed height थी इसलिए image cut हो रही थी
      // अब responsive aspect ratio use होगा

      aspectRatio: 2.1, // ✅ professional responsive ratio

      borderRadius:
        width < 360
          ? wp(5)
          : wp(5.5),

      backgroundColor: '#EDEDED',

      // ✅ image properly fit होगी
      overflow: 'hidden',
    },

    // ✅ Dots Container
    dotsContainer: {
      flexDirection: 'row',

      justifyContent:
        'center',

      alignItems: 'center',

      marginTop: hp(1.5),
    },

    // ✅ Normal Dot
    dot: {
      width:
        width < 360
          ? wp(1.8)
          : wp(2),

      height:
        width < 360
          ? wp(1.8)
          : wp(2),

      borderRadius:
        wp(5),

      backgroundColor:
        '#ccc',

      marginHorizontal:
        wp(1),
    },

    // ✅ Active Dot
    activeDot: {
      backgroundColor:
        '#4c8c2b',

      width:
        width < 360
          ? wp(2.4)
          : wp(2.6),

      height:
        width < 360
          ? wp(2.4)
          : wp(2.6),

      borderRadius:
        wp(5),
    },
  });