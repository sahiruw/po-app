import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { PieChart } from "react-native-chart-kit";
import AppBarC from "../components/AppBarC";

const StatisticsScreen = () => {
  // Sample data for employee progress (Line Chart)
  const progressData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
    datasets: [
      {
        data: [15, 20, 30, 25, 35],
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Blue color
        strokeWidth: 2,
      },
    ],
  };

  // Sample data for employee tasks (Pie Chart)
  const tasksData = [
    { name: "Completed", population: 60, color: "green" },
    { name: "In Progress", population: 30, color: "orange" },
    { name: "Not Started", population: 10, color: "red" },
  ];

  return (
    <>
      <AppBarC title="Statistics" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Employee Statistics</Text>

        {/* Progress Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Progress Chart</Text>
          <LineChart
            data={progressData}
            width={320}
            height={220}
            yAxisSuffix="%"
            chartConfig={{
              backgroundGradientFrom: "white",
              backgroundGradientTo: "white",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#000",
              },
            }}
            bezier
          />
        </View>

        {/* Tasks Pie Chart */}
        <View style={styles.pieChartContainer}>
          <Text style={styles.chartTitle}>Tasks Distribution</Text>
          <PieChart
            data={tasksData}
            width={320}
            height={220}
            chartConfig={{
              backgroundGradientFrom: "white",
              backgroundGradientTo: "white",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
          />
        </View>

        {/* Past Statistics */}
        <View style={styles.pastStatisticsContainer}>
          <Text style={styles.pastStatisticsTitle}>Past Statistics</Text>
          {/* Display past statistics here */}
          {/* You can use various chart types (e.g., LineChart, BarChart) */}
        </View>
      </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
    container: {
      flexGrow: 1, // Allow content to grow within the ScrollView
      alignItems: "center",
      padding: 20,
    },
    header: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
    },
    chartContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    pieChartContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    chartTitle: {
      fontSize: 18,
      fontWeight: "bold",
    },
    pastStatisticsContainer: {
      alignItems: "center",
    },
    pastStatisticsTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 20,
    },
  });
  

export default StatisticsScreen;
