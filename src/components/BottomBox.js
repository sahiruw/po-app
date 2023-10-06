import React, { Component } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';


class BottomBox extends Component {
    constructor(props) {
      super(props);
      this.state = {
        translateY: new Animated.Value(500), // Initial position (off-screen)
      };
    }
  
    componentDidMount() {
      this.animateIn();
    }
  
    animateIn() {
      Animated.timing(this.state.translateY, {
        toValue: 0, // Final position (on-screen)
        duration: 500, // Duration of the animation in milliseconds
        easing: Easing.ease, // Easing function
        useNativeDriver: false, // You can set this to true for performance improvement on some devices
      }).start();
    }
  
    render() {
      const { translateY } = this.state;
  
      return (
        <Animated.View
          style={[
            styles.container,
            {
                padding:0,
              transform: [{ translateY }],
            },
          ]}
        >
          {/* Your green box content */}
          <View style={styles.greenBox}></View>
        </Animated.View>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end', // Align at the bottom of the screen
      alignItems: 'center', // Center horizontally
    },
    greenBox: {
      width: 200,
      height: 250,
      backgroundColor: 'green',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
    },
  });
  
  export default BottomBox;
  