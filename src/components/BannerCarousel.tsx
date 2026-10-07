import React, {useEffect, useRef, useState} from 'react';
import {FlatList, Image, ImageSourcePropType, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, useWindowDimensions, View} from 'react-native';

type Props = {images: ImageSourcePropType[]; interval?: number};

export default function BannerCarousel({images, interval = 4000}: Props) {
  const {width} = useWindowDimensions();
  const itemWidth = width - 36;
  const listRef = useRef<FlatList<ImageSourcePropType>>(null);
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) { return; }
    const timer = setInterval(() => {
      const next = (indexRef.current + 1) % images.length;
      listRef.current?.scrollToIndex({animated: true, index: next});
      indexRef.current = next;
      setIndex(next);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(event.nativeEvent.contentOffset.x / itemWidth);
    indexRef.current = next;
    setIndex(next);
  };

  return (
    <View>
      <FlatList ref={listRef} data={images} horizontal pagingEnabled bounces={false} showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)} onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, i) => ({index: i, length: itemWidth, offset: itemWidth * i})}
        renderItem={({item}) => <View style={{width: itemWidth}}><Image source={item} resizeMode="contain" style={styles.image} /></View>} />
      {images.length > 1 && <View style={styles.dots}>{images.map((_, i) => <View key={i} style={[styles.dot, i === index && styles.activeDot]} />)}</View>}
    </View>
  );
}

const styles = StyleSheet.create({image: {height: 221, width: '100%'}, dots: {bottom: 7, flexDirection: 'row', gap: 5, position: 'absolute', alignSelf: 'center'}, dot: {backgroundColor: '#D6D6D6', borderRadius: 3, height: 5, width: 5}, activeDot: {backgroundColor: '#E7530D', width: 14}});
