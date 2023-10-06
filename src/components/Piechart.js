import React from 'react';
import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';



const PieChart = ({data}) => {
  const totalValue = data.reduce((acc, item) => acc + item.value, 0);
  const centerX = 80; // Adjust as needed
  const centerY = 100; // Adjust as needed
  const radius = 80; // Adjust as needed
  let startAngle = 0;

  return (
    <View>
      <Svg width="200" height="200">
        {data.map((item, index) => {
          const endAngle = (item.value / totalValue) * 360 + startAngle;
          const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
          const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
          const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
          const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
          const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

          // Path definition for the pie slice
          const path = `M${centerX},${centerY} L${x1},${y1} A${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`;

          startAngle = endAngle;

          return (
            <G key={index}>
              <Path d={path} fill={item.color} />
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

export default PieChart;
