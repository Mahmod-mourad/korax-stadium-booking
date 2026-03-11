/**
 * Avatar — صورة شخصية مع fallback بالأحرف الأولى
 *
 * size: sm(32) | md(44) | lg(64) | xl(90)
 */
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors, Radius } from '../../theme';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<AvatarSize, number> = {
  sm: 32, md: 44, lg: 64, xl: 90,
};

interface AvatarProps {
  name: string;
  uri?: string;
  size?: AvatarSize;
  /** لون خلفية الـ fallback */
  bgColor?: string;
}

export function Avatar({ name, uri, size = 'md', bgColor = Colors.primary }: AvatarProps) {
  const dim = SIZE_MAP[size];
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join('');

  return (
    <View style={[
      styles.container,
      { width: dim, height: dim, borderRadius: dim / 2, backgroundColor: bgColor },
    ]}>
      {uri
        ? <Image source={{ uri }} style={[styles.image, { borderRadius: dim / 2 }]} />
        : <Text style={[styles.initials, { fontSize: dim * 0.38 }]}>{initials}</Text>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  initials: { color: '#fff', fontWeight: '900' },
});
