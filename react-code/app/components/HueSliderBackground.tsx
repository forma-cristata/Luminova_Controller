import { StyleSheet, View } from 'react-native';

    const HueSliderBackground = () => {
      // Rainbow colors representing the hue spectrum from 0-360°
      const hueColors = [
        '#FF0000',
        '#FF1700',
          '#FF2E00',
          '#FF4600',
          '#FF7400',
          '#FF8B00',
          '#FFA200',
          '#FFB900',
          '#FFD100',
          '#FFE800',
        '#FFFF00', // 60° - yellow
          '#E8FF00',
          '#D1FF00',
          '#B9FF00',
          '#A2FF00',
          '#8BFF00',
          '#74FF00',
          '#5DFF00',
          '#46FF00',
          '#2EFF00',
            '#17FF00',
        '#00FF00', // 120° - green
        '#00FF17',
        '#00FF2E',
        '#00FF46',
        '#00FF5D',
        '#00FF74',
        '#00FF8B',
        '#00FFA2',
        '#00FFB9',
        '#00FFD1',
        '#00FFE8', // 180° - cyan
        '#00FFFF', // 180° - cyan
        '#00E8FF', // 210° - light blue
        '#00D1FF', // 210° - light blue
        '#00B9FF', // 210° - light blue
        '#00A2FF', // 210° - light blue
        '#008BFF', // 210° - light blue
        '#0074FF', // 210° - light blue
        '#005DFF', // 210° - light blue
        '#0046FF', // 210° - light blue
        '#002EFF', // 210° - light blue
        '#0017FF', // 210° - light blue
        '#0000FF', // 240° - blue
        '#1700FF', // 270° - purple
        '#2E00FF', // 270° - purple
        '#4600FF', // 270° - purple
        '#5D00FF', // 270° - purple
        '#7400FF', // 270° - purple
        '#8B00FF', // 270° - purple
        '#A200FF', // 270° - purple
        '#B900FF', // 270° - purple
        '#D100FF', // 270° - purple
        '#E800FF', // 270° - purple
        '#FF00FF', // 300° - magenta
        '#FF00E8', // 330° - magenta
        '#FF00D1', // 330° - magenta
        '#FF00B9', // 330° - magenta
        '#FF00A2', // 330° - magenta
        '#FF008B', // 330° - magenta
        '#FF0074', // 330° - magenta
        '#FF005D', // 330° - magenta
        '#FF0046', // 330° - magenta
        '#FF002E', // 330° - magenta
        '#FF0017', // 330° - magenta
        '#FF0000', // 360° - back to red
      ];

      return (
        <View style={styles.sliderBackground}>
          <View style={styles.colorStrip}>
            {hueColors.map((color, index) => (
              <View
                key={index}
                style={[styles.colorSegment, { backgroundColor: color }]}
              />
            ))}
          </View>
        </View>
      );
    };

    const styles = StyleSheet.create({
      sliderBackground: {
        height: 10,
        width: '100%',
        borderRadius: 5,
        overflow: 'hidden',
        position: 'absolute',
      },
      colorStrip: {
        flex: 1,
        flexDirection: 'row',
      },
      colorSegment: {
        flex: 1,
        height: '100%',
      }
    });

    export default HueSliderBackground;